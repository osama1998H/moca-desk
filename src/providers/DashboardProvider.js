import { useQuery } from "@tanstack/react-query";
import { get } from "@/api/client";
const DASH_STALE = 5 * 60 * 1000;
export function useDashboardDef(name) {
    return useQuery({
        queryKey: ["dashboard", name],
        queryFn: async () => {
            const res = await get(`dashboard/${encodeURIComponent(name)}`);
            return res.data;
        },
        staleTime: DASH_STALE,
        enabled: name.length > 0,
    });
}
export function useDashboardWidget(name, idx) {
    return useQuery({
        queryKey: ["dashboardWidget", name, idx],
        queryFn: async () => {
            const res = await get(`dashboard/${encodeURIComponent(name)}/widget/${idx}`);
            return res.data;
        },
        staleTime: DASH_STALE,
        enabled: name.length > 0 && idx >= 0,
    });
}
