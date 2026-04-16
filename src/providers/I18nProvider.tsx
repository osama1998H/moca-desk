import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { get, setLanguageGetter } from "@/api/client";
import { useAuth } from "@/providers/AuthProvider";

// ── Context shape ───────────────────────────────────────────────────────────

interface I18nState {
  /** Translate a source string. Returns the translation or the source unchanged. */
  t: (source: string) => string;
  /** Current language code (e.g. "ar", "fr", "en"). */
  language: string;
  /** Text direction for current language ("ltr" or "rtl"). */
  direction: "ltr" | "rtl";
  /** True while the translation bundle is being fetched. */
  isLoading: boolean;
  /** Switch the active language. Persists to localStorage and triggers refetch. */
  setLanguage: (lang: string) => void;
}

const I18nContext = createContext<I18nState | null>(null);

const I18N_STALE_TIME = 30 * 60 * 1000; // 30 minutes
const I18N_GC_TIME = 60 * 60 * 1000; // 60 minutes
const LANGUAGE_STORAGE_KEY = "moca_language";

// ── Provider ────────────────────────────────────────────────────────────────

export function I18nProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  // Resolve initial language: localStorage override → user preference → browser → "en".
  const [language, setLanguageState] = useState<string>(() => {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored) return stored;
    if (user?.user_defaults?.language) return user.user_defaults.language;
    const browserLang = navigator.language?.split("-")[0];
    return browserLang || "en";
  });

  // Sync language getter to API client module.
  useEffect(() => {
    setLanguageGetter(() => language);
  }, [language]);

  // When user changes (login/token refresh), pick up server preference
  // unless user has already overridden locally.
  useEffect(() => {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (!stored && user?.user_defaults?.language) {
      setLanguageState(user.user_defaults.language);
    }
  }, [user]);

  // Fetch translation bundle + direction from the API.
  const { data, isLoading } = useQuery({
    queryKey: ["translations", language],
    queryFn: async () => {
      const res = await get<{ data: Record<string, string>; direction: string }>(
        `translations/${language}`,
      );
      return res;
    },
    staleTime: I18N_STALE_TIME,
    gcTime: I18N_GC_TIME,
    enabled: language !== "en", // Skip fetch for English (source language).
  });

  const direction: "ltr" | "rtl" =
    language === "en" ? "ltr" : (data?.direction as "ltr" | "rtl") ?? "ltr";

  // Set dir and lang on <html> element.
  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [direction, language]);

  // Public setLanguage — persists to localStorage.
  const setLanguage = useCallback((lang: string) => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    setLanguageState(lang);
  }, []);

  const value = useMemo<I18nState>(() => {
    const translationMap = data?.data ?? {};
    return {
      t: (source: string) => translationMap[source] ?? source,
      language,
      direction,
      isLoading,
      setLanguage,
    };
  }, [data, language, direction, isLoading, setLanguage]);

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
