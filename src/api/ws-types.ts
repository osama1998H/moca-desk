// WebSocket message types — mirrors Go structs in internal/serve/websocket.go

/** Client → server message (subscribe/unsubscribe to doctypes). */
export interface WsClientMessage {
  type: "subscribe" | "unsubscribe";
  doctype: string;
}

/** Server → client message. */
export interface WsServerMessage {
  type: "doc_update" | "subscribed" | "unsubscribed" | "error";
  site?: string;
  doctype?: string;
  name?: string;
  event_type?: string;
  user?: string;
  timestamp?: string;
  message?: string;
}

/** Narrowed type for doc_update events dispatched to subscribers. */
export interface DocUpdateEvent {
  type: "doc_update";
  site: string;
  doctype: string;
  name: string;
  event_type: string;
  user: string;
  timestamp: string;
}

/** WebSocket connection state exposed to consumers. */
export type WsConnectionState =
  | "connecting"
  | "connected"
  | "disconnected"
  | "reconnecting";

// ── Version History types ──────────────────────────────────────────────────

/** Mirrors VersionRecord from pkg/document/version.go. */
export interface VersionRecord {
  name: string;
  ref_doctype: string;
  docname: string;
  data: {
    changed: Record<string, { old: unknown; new: unknown }> | null;
    snapshot: Record<string, unknown>;
  };
  owner: string;
  creation: string;
}

/** Version list response envelope (matches listEnvelope from pkg/api/response.go). */
export interface VersionListResponse {
  data: VersionRecord[];
  meta: { total: number; limit: number; offset: number };
}
