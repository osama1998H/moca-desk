import { createContext, useContext } from "react";
export const defaultConfig = {
    basePath: "/desk",
    apiBaseUrl: "/api/v1",
    siteName: import.meta.env.VITE_MOCA_SITE ?? "",
    toasterPosition: "bottom-right",
};
// ── React context ──────────────────────────────────────────────────────────
export const DeskConfigContext = createContext(defaultConfig);
export function useDeskConfig() {
    return useContext(DeskConfigContext);
}
