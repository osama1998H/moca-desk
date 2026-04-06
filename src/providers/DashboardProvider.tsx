import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { get } from "@/api/client";
import type { ApiResponse, DashDef } from "@/api/types";

const DASH_STALE = 5 * 60 * 1000;

export function useDashboardDef(
  name: string,
): UseQueryResult<DashDef, Error> {
  return useQuery({
    queryKey: ["dashboard", name],
    queryFn: async () => {
      const res = await get<ApiResponse<DashDef>>(
        `dashboard/${encodeURIComponent(name)}`,
      );
      return res.data;
    },
    staleTime: DASH_STALE,
    enabled: name.length > 0,
  });
}

export function useDashboardWidget(
  name: string,
  idx: number,
): UseQueryResult<Record<string, unknown>, Error> {
  return useQuery({
    queryKey: ["dashboardWidget", name, idx],
    queryFn: async () => {
      const res = await get<ApiResponse<Record<string, unknown>>>(
        `dashboard/${encodeURIComponent(name)}/widget/${idx}`,
      );
      return res.data;
    },
    staleTime: DASH_STALE,
    enabled: name.length > 0 && idx >= 0,
  });
}
