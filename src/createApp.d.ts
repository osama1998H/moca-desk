import { type DeskConfig } from "@/config";
import "./index.css";
export interface DeskAppConfig extends Partial<DeskConfig> {
    /** Override React Query defaults. */
    queryClientOptions?: {
        staleTime?: number;
        retry?: number | false;
        refetchOnWindowFocus?: boolean;
    };
}
export interface DeskApp {
    /** Mount the desk application into the given DOM element. */
    mount(selector: string): void;
    /** Return the resolved configuration. */
    getConfig(): DeskConfig;
}
/**
 * Create a Moca Desk application instance.
 *
 * Usage in a project's `main.tsx`:
 * ```tsx
 * import { createDeskApp } from "@osama1998h/desk";
 * import "./.moca-extensions";
 *
 * createDeskApp().mount("#root");
 * ```
 */
export declare function createDeskApp(userConfig?: DeskAppConfig): DeskApp;
