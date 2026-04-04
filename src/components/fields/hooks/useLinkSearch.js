import { useQuery } from "@tanstack/react-query";
import { get } from "@/api/client";
import { useState, useEffect } from "react";
export function useLinkSearch(doctype, searchText, enabled) {
    const [debouncedText, setDebouncedText] = useState(searchText);
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedText(searchText), 300);
        return () => clearTimeout(timer);
    }, [searchText]);
    const query = useQuery({
        queryKey: ["linkSearch", doctype, debouncedText],
        queryFn: async () => {
            const params = {
                limit: "20",
            };
            if (debouncedText) {
                params["filters"] = JSON.stringify([
                    ["name", "like", `%${debouncedText}%`],
                ]);
            }
            const res = await get(`resource/${doctype}`, params);
            return res.data.map((doc) => ({
                value: String(doc["name"] ?? ""),
                label: String(doc["name"] ?? ""),
            }));
        },
        enabled: enabled && doctype.length > 0,
        staleTime: 30_000,
    });
    return {
        results: query.data ?? [],
        isLoading: query.isLoading,
    };
}
