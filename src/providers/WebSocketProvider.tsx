import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getAccessToken } from "@/api/client";
import { useAuth } from "@/providers/AuthProvider";
import type {
  DocUpdateEvent,
  WsClientMessage,
  WsConnectionState,
  WsServerMessage,
} from "@/api/ws-types";

// ── Context shape ──────────────────────────────────────────────────────────

interface WebSocketContextValue {
  connectionState: WsConnectionState;
  subscribe: (
    doctype: string,
    callback: (event: DocUpdateEvent) => void,
  ) => () => void;
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

// ── Constants ──────────────────────────────────────────────────────────────

const INITIAL_BACKOFF = 1000;
const MAX_BACKOFF = 30_000;

// ── Provider ───────────────────────────────────────────────────────────────

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [connectionState, setConnectionState] =
    useState<WsConnectionState>("disconnected");

  // Mutable refs for WebSocket lifecycle (avoids effect dependency churn)
  const wsRef = useRef<WebSocket | null>(null);
  const backoffRef = useRef(INITIAL_BACKOFF);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const subsRef = useRef(new Map<string, Set<(e: DocUpdateEvent) => void>>());

  // Send a JSON message if the socket is open.
  const send = useCallback((msg: WsClientMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    }
  }, []);

  // Core connection logic — wrapped in useCallback so the reconnect timer can
  // reference the latest version without an effect dependency cycle.
  const connect = useCallback(() => {
    const token = getAccessToken();
    if (!token) return;

    const protocol = location.protocol === "https:" ? "wss" : "ws";
    const url = `${protocol}://${location.host}/ws?token=${token}`;

    setConnectionState((prev) =>
      prev === "disconnected" ? "connecting" : "reconnecting",
    );

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnectionState("connected");
      backoffRef.current = INITIAL_BACKOFF;

      // Re-subscribe to any active doctypes (after reconnect)
      for (const doctype of subsRef.current.keys()) {
        send({ type: "subscribe", doctype });
      }
    };

    ws.onmessage = (event: MessageEvent) => {
      try {
        const msg = JSON.parse(String(event.data)) as WsServerMessage;
        if (msg.type === "doc_update" && msg.doctype) {
          const callbacks = subsRef.current.get(msg.doctype);
          if (callbacks) {
            const docEvent = msg as unknown as DocUpdateEvent;
            for (const cb of callbacks) {
              cb(docEvent);
            }
          }
        }
      } catch {
        // Ignore malformed messages.
      }
    };

    ws.onclose = () => {
      wsRef.current = null;
      setConnectionState("disconnected");
      scheduleReconnect();
    };

    ws.onerror = () => {
      // onclose fires after onerror — reconnect is handled there.
    };

    function scheduleReconnect() {
      const delay = backoffRef.current;
      backoffRef.current = Math.min(delay * 2, MAX_BACKOFF);
      reconnectTimerRef.current = setTimeout(() => {
        // Only reconnect if still authenticated.
        if (getAccessToken()) {
          setConnectionState("reconnecting");
          connect();
        }
      }, delay);
    }
  }, [send]);

  // Manage connection lifecycle based on auth state.
  useEffect(() => {
    if (isAuthenticated) {
      connect();
    }

    return () => {
      clearTimeout(reconnectTimerRef.current);
      if (wsRef.current) {
        wsRef.current.onclose = null; // Prevent reconnect on intentional close
        wsRef.current.close();
        wsRef.current = null;
      }
      setConnectionState("disconnected");
    };
  }, [isAuthenticated, connect]);

  // Subscribe to real-time events for a doctype.
  const subscribe = useCallback(
    (
      doctype: string,
      callback: (event: DocUpdateEvent) => void,
    ): (() => void) => {
      const subs = subsRef.current;
      let callbacks = subs.get(doctype);
      if (!callbacks) {
        callbacks = new Set();
        subs.set(doctype, callbacks);
        // First subscriber — tell the server.
        send({ type: "subscribe", doctype });
      }
      callbacks.add(callback);

      // Return unsubscribe function.
      return () => {
        callbacks!.delete(callback);
        if (callbacks!.size === 0) {
          subs.delete(doctype);
          send({ type: "unsubscribe", doctype });
        }
      };
    },
    [send],
  );

  return (
    <WebSocketContext.Provider value={{ connectionState, subscribe }}>
      {children}
    </WebSocketContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useWebSocket(): WebSocketContextValue {
  const ctx = useContext(WebSocketContext);
  if (!ctx) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return ctx;
}
