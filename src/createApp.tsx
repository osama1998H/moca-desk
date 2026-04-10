import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/providers/AuthProvider";
import { I18nProvider } from "@/providers/I18nProvider";
import { WebSocketProvider } from "@/providers/WebSocketProvider";
import { App } from "@/App";
import { createRouter } from "@/router";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DeskConfigContext, defaultConfig, type DeskConfig } from "@/config";
import { setSite } from "@/api/client";
import "./index.css";

// ── Types ──────────────────────────────────────────────────────────────────

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

// ── Factory ────────────────────────────────────────────────────────────────

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
export function createDeskApp(userConfig: DeskAppConfig = {}): DeskApp {
  const { queryClientOptions, ...configOverrides } = userConfig;

  const config: DeskConfig = { ...defaultConfig, ...configOverrides };

  // Propagate siteName to the API client module so HTTP requests
  // include the correct X-Moca-Site header even outside React context.
  if (config.siteName) {
    setSite(config.siteName);
  }

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: queryClientOptions?.staleTime ?? 5 * 60 * 1000,
        retry: queryClientOptions?.retry ?? 1,
        refetchOnWindowFocus: queryClientOptions?.refetchOnWindowFocus ?? true,
      },
    },
  });

  return {
    mount(selector: string) {
      const el = document.querySelector(selector);
      if (!el) {
        throw new Error(`[moca] Mount element not found: ${selector}`);
      }

      const router = createRouter();

      createRoot(el).render(
        <StrictMode>
          <DeskConfigContext.Provider value={config}>
            <QueryClientProvider client={queryClient}>
              <AuthProvider>
                <I18nProvider>
                  <WebSocketProvider>
                    <TooltipProvider>
                      <App router={router} />
                      <Toaster
                        position={config.toasterPosition ?? "bottom-right"}
                        richColors
                      />
                    </TooltipProvider>
                  </WebSocketProvider>
                </I18nProvider>
              </AuthProvider>
            </QueryClientProvider>
          </DeskConfigContext.Provider>
        </StrictMode>,
      );
    },

    getConfig() {
      return config;
    },
  };
}
