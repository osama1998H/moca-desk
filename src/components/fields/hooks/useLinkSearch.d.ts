interface LinkSearchResult {
    value: string;
    label: string;
}
export declare function useLinkSearch(doctype: string, searchText: string, enabled: boolean): {
    results: LinkSearchResult[];
    isLoading: boolean;
};
export {};
