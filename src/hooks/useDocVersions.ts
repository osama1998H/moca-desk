import { useInfiniteQuery } from "@tanstack/react-query";
import { get } from "@/api/client";
import type { VersionListResponse } from "@/api/ws-types";

const PAGE_SIZE = 20;

/**
 * Fetch paginated version history for a document.
 * Uses TanStack infinite query for "Load more" support.
 */
export function useDocVersions(
  doctype: string,
  name: string,
  options?: { enabled?: boolean },
) {
  return useInfiniteQuery({
    queryKey: ["docVersions", doctype, name],
    queryFn: ({ pageParam = 0 }) =>
      get<VersionListResponse>(
        `resource/${doctype}/${encodeURIComponent(name)}/versions`,
        { limit: String(PAGE_SIZE), offset: String(pageParam) },
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const next = lastPage.meta.offset + lastPage.meta.limit;
      return next < lastPage.meta.total ? next : undefined;
    },
    enabled: (options?.enabled ?? true) && doctype.length > 0 && name.length > 0,
  });
}
