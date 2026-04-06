import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useMemo, } from "react";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/api/client";
import { useAuth } from "@/providers/AuthProvider";
const I18nContext = createContext(null);
const I18N_STALE_TIME = 30 * 60 * 1000; // 30 minutes
const I18N_GC_TIME = 60 * 60 * 1000; // 60 minutes
// ── Provider ────────────────────────────────────────────────────────────────
export function I18nProvider({ children }) {
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
            const res = await get(`translations/${language}`);
            return res.data;
        },
        staleTime: I18N_STALE_TIME,
        gcTime: I18N_GC_TIME,
        enabled: language !== "en", // Skip fetch for English (source language).
    });
    const value = useMemo(() => {
        const translationMap = translations ?? {};
        return {
            t: (source) => translationMap[source] ?? source,
            language,
            isLoading,
        };
    }, [translations, language, isLoading]);
    return _jsx(I18nContext.Provider, { value: value, children: children });
}
// ── Hook ────────────────────────────────────────────────────────────────────
export function useI18n() {
    const ctx = useContext(I18nContext);
    if (!ctx) {
        throw new Error("useI18n must be used within an I18nProvider");
    }
    return ctx;
}
