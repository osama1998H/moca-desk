import type { Plugin, PluginOption, UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// ── Options ────────────────────────────────────────────────────────────────

export interface MocaDeskPluginOptions {
  /** Base path for the desk app. Default: "/desk/" */
  basePath?: string;
  /** Backend API target for dev proxy. Default: "http://localhost:8000" */
  apiTarget?: string;
  /** Backend WebSocket target for dev proxy. Default: "http://localhost:8000" */
  wsTarget?: string;
  /** Vite dev server port. Default: 3000 */
  port?: number;
}

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
export function mocaDeskPlugin(
  options: MocaDeskPluginOptions = {},
): PluginOption[] {
  const {
    basePath = "/desk/",
    apiTarget = "http://localhost:8000",
    wsTarget = "http://localhost:8000",
    port = 3000,
  } = options;

  const mocaPlugin: Plugin = {
    name: "moca-desk",
    config(): UserConfig {
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
