import { useQuery, useMutation, } from "@tanstack/react-query";
import { get, post } from "@/api/client";
const REPORT_META_STALE = 5 * 60 * 1000;
export function useReportMeta(name) {
    return useQuery({
        queryKey: ["reportMeta", name],
        queryFn: async () => {
            const res = await get(`report/${encodeURIComponent(name)}/meta`);
            return res.data;
        },
        staleTime: REPORT_META_STALE,
        enabled: name.length > 0,
    });
}
export function useReportExecute(name) {
    return useMutation({
        mutationFn: (req) => post(`report/${encodeURIComponent(name)}/execute`, req),
    });
}
