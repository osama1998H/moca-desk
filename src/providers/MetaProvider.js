import { useQuery } from "@tanstack/react-query";
import { get } from "@/api/client";
const META_STALE_TIME = 5 * 60 * 1000; // 5 minutes
const META_GC_TIME = 30 * 60 * 1000; // 30 minutes
export function useMetaType(doctype) {
    return useQuery({
        queryKey: ["meta", doctype],
        queryFn: async () => {
            const res = await get(`meta/${doctype}`);
            return res.data;
        },
        staleTime: META_STALE_TIME,
        gcTime: META_GC_TIME,
        enabled: doctype.length > 0,
    });
}
