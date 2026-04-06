import {
  useQuery,
  useMutation,
  type UseQueryResult,
  type UseMutationResult,
} from "@tanstack/react-query";
import { get, post } from "@/api/client";
import type {
  ApiResponse,
  DocRecord,
  ListResponse,
  ReportMeta,
  ReportExecuteRequest,
} from "@/api/types";

const REPORT_META_STALE = 5 * 60 * 1000;

export function useReportMeta(
  name: string,
): UseQueryResult<ReportMeta, Error> {
  return useQuery({
    queryKey: ["reportMeta", name],
    queryFn: async () => {
      const res = await get<ApiResponse<ReportMeta>>(
        `report/${encodeURIComponent(name)}/meta`,
      );
      return res.data;
    },
    staleTime: REPORT_META_STALE,
    enabled: name.length > 0,
  });
}

export function useReportExecute(
  name: string,
): UseMutationResult<ListResponse<DocRecord>, Error, ReportExecuteRequest> {
  return useMutation({
    mutationFn: (req: ReportExecuteRequest) =>
      post<ListResponse<DocRecord>>(
        `report/${encodeURIComponent(name)}/execute`,
        req,
      ),
  });
}
