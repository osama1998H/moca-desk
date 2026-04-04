import { useQuery } from "@tanstack/react-query";
import { get } from "@/api/client";
import type { ListResponse, DocRecord } from "@/api/types";
import { useState, useEffect } from "react";

interface LinkSearchResult {
  value: string;
  label: string;
}

export function useLinkSearch(
  doctype: string,
  searchText: string,
  enabled: boolean,
) {
  const [debouncedText, setDebouncedText] = useState(searchText);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedText(searchText), 300);
    return () => clearTimeout(timer);
  }, [searchText]);

  const query = useQuery({
    queryKey: ["linkSearch", doctype, debouncedText],
    queryFn: async () => {
      const params: Record<string, string> = {
        limit: "20",
      };
      if (debouncedText) {
        params["filters"] = JSON.stringify([
          ["name", "like", `%${debouncedText}%`],
        ]);
      }
      const res = await get<ListResponse<DocRecord>>(
        `resource/${doctype}`,
        params,
      );
      return res.data.map(
        (doc): LinkSearchResult => ({
          value: String(doc["name"] ?? ""),
          label: String(doc["name"] ?? ""),
        }),
      );
    },
    enabled: enabled && doctype.length > 0,
    staleTime: 30_000,
  });

  return {
    results: query.data ?? [],
    isLoading: query.isLoading,
  };
}
