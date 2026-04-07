import { createContext, useContext } from "react";

// ── DeskConfig ─────────────────────────────────────────────────────────────

export interface DeskConfig {
  /** Base path for all desk routes. Default: "/desk" */
  basePath: string;
  /** API base URL prefix. Default: "/api/v1" */
  apiBaseUrl: string;
  /** Site name sent via X-Moca-Site header. Default: VITE_MOCA_SITE env */
  siteName: string;
  /** WebSocket endpoint override. Default: auto-derived from location */
  wsEndpoint?: string;
  /** Toaster position. Default: "bottom-right" */
  toasterPosition?:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "top-center"
    | "bottom-center";
}

export const defaultConfig: DeskConfig = {
  basePath: "/desk",
  apiBaseUrl: "/api/v1",
  siteName: import.meta.env.VITE_MOCA_SITE ?? "",
  toasterPosition: "bottom-right",
};

// ── React context ──────────────────────────────────────────────────────────

export const DeskConfigContext = createContext<DeskConfig>(defaultConfig);

export function useDeskConfig(): DeskConfig {
  return useContext(DeskConfigContext);
}
