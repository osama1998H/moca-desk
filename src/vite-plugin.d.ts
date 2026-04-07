import type { PluginOption } from "vite";
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
export declare function mocaDeskPlugin(options?: MocaDeskPluginOptions): PluginOption[];
