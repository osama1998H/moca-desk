import { useInfiniteQuery } from "@tanstack/react-query";
import { get } from "@/api/client";
const PAGE_SIZE = 20;
/**
 * Fetch paginated version history for a document.
 * Uses TanStack infinite query for "Load more" support.
 */
export function useDocVersions(doctype, name, options) {
    return useInfiniteQuery({
        queryKey: ["docVersions", doctype, name],
        queryFn: ({ pageParam = 0 }) => get(`resource/${doctype}/${encodeURIComponent(name)}/versions`, { limit: String(PAGE_SIZE), offset: String(pageParam) }),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            const next = lastPage.meta.offset + lastPage.meta.limit;
            return next < lastPage.meta.total ? next : undefined;
        },
        enabled: (options?.enabled ?? true) && doctype.length > 0 && name.length > 0,
    });
}
