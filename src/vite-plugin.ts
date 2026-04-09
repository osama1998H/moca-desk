import path from "node:path";
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
 * import { mocaDeskPlugin } from "@osama1998h/desk/vite";
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
      // Resolve shared dependencies so that app extension files living outside
      // desk/ (e.g. apps/library/desk/pages/Foo.tsx) find the correct packages.
      const nodeModules = path.resolve(process.cwd(), "node_modules");
      const projectRoot = path.resolve(process.cwd(), "..");

      return {
        base: basePath,
        resolve: {
          alias: {
            "@osama1998h/desk": path.resolve(nodeModules, "@osama1998h/desk"),
            react: path.resolve(nodeModules, "react"),
            "react-dom": path.resolve(nodeModules, "react-dom"),
            "react/jsx-runtime": path.resolve(
              nodeModules,
              "react/jsx-runtime",
            ),
            "react/jsx-dev-runtime": path.resolve(
              nodeModules,
              "react/jsx-dev-runtime",
            ),
          },
        },
        server: {
          port,
          fs: {
            // Allow Vite to serve files from the project root (covers apps/*/desk/**)
            allow: [projectRoot],
          },
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
