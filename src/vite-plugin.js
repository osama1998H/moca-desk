import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// ── Plugin ─────────────────────────────────────────────────────────────────
/**
 * Vite plugin bundle for Moca Desk projects.
 *
 * Encapsulates React, TailwindCSS, base path, and dev proxy configuration.
 *
 * Usage in a project's `vite.config.ts`:
 * ```ts
 * import { defineConfig } from "vite";
 * import { mocaDeskPlugin } from "@moca/desk/vite";
 *
 * export default defineConfig({
 *   plugins: [mocaDeskPlugin()],
 * });
 * ```
 */
export function mocaDeskPlugin(options = {}) {
    const { basePath = "/desk/", apiTarget = "http://localhost:8000", wsTarget = "http://localhost:8000", port = 3000, } = options;
    const mocaPlugin = {
        name: "moca-desk",
        config() {
            return {
                base: basePath,
                server: {
                    port,
                    proxy: {
                        "/api": { target: apiTarget, changeOrigin: true },
                        "/ws": { target: wsTarget, ws: true },
                    },
                },
                build: {
                    outDir: "dist",
                },
            };
        },
    };
    return [react(), tailwindcss(), mocaPlugin];
}
