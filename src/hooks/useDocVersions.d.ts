import type { VersionListResponse } from "@/api/ws-types";
/**
 * Fetch paginated version history for a document.
 * Uses TanStack infinite query for "Load more" support.
 */
export declare function useDocVersions(doctype: string, name: string, options?: {
    enabled?: boolean;
}): import("@tanstack/react-query").UseInfiniteQueryResult<import("@tanstack/query-core").InfiniteData<VersionListResponse, unknown>, Error>;
