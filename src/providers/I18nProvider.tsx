import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/api/client";
import { useAuth } from "@/providers/AuthProvider";

// ── Context shape ───────────────────────────────────────────────────────────

interface I18nState {
  /** Translate a source string. Returns the translation or the source unchanged. */
  t: (source: string) => string;
  /** Current language code (e.g. "ar", "fr", "en"). */
  language: string;
  /** True while the translation bundle is being fetched. */
  isLoading: boolean;
}

const I18nContext = createContext<I18nState | null>(null);

const I18N_STALE_TIME = 30 * 60 * 1000; // 30 minutes
const I18N_GC_TIME = 60 * 60 * 1000; // 60 minutes

// ── Provider ────────────────────────────────────────────────────────────────

export function I18nProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  // Resolve language: user preference → browser default → "en".
  const language = useMemo(() => {
    if (user?.user_defaults?.language) {
      return user.user_defaults.language;
    }
    const browserLang = navigator.language?.split("-")[0];
    return browserLang || "en";
  }, [user]);

  // Fetch translation bundle from the API.
  const { data: translations, isLoading } = useQuery({
    queryKey: ["translations", language],
    queryFn: async () => {
      const res = await get<{ data: Record<string, string> }>(
        `translations/${language}`,
      );
      return res.data;
    },
    staleTime: I18N_STALE_TIME,
    gcTime: I18N_GC_TIME,
    enabled: language !== "en", // Skip fetch for English (source language).
  });

  const value = useMemo<I18nState>(() => {
    const translationMap = translations ?? {};
    return {
      t: (source: string) => translationMap[source] ?? source,
      language,
      isLoading,
    };
  }, [translations, language, isLoading]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

// ── Hook ────────────────────────────────────────────────────────────────────

export function useI18n(): I18nState {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return ctx;
}
