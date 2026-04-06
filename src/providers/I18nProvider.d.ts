import { type ReactNode } from "react";
interface I18nState {
    /** Translate a source string. Returns the translation or the source unchanged. */
    t: (source: string) => string;
    /** Current language code (e.g. "ar", "fr", "en"). */
    language: string;
    /** True while the translation bundle is being fetched. */
    isLoading: boolean;
}
export declare function I18nProvider({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useI18n(): I18nState;
export {};
