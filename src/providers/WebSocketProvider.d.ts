import { type ReactNode } from "react";
import type { DocUpdateEvent, WsConnectionState } from "@/api/ws-types";
interface WebSocketContextValue {
    connectionState: WsConnectionState;
    subscribe: (doctype: string, callback: (event: DocUpdateEvent) => void) => () => void;
}
export declare function WebSocketProvider({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useWebSocket(): WebSocketContextValue;
export {};
