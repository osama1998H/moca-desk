import { type UseQueryResult, type UseMutationResult } from "@tanstack/react-query";
import type { DocRecord, ListResponse, ReportMeta, ReportExecuteRequest } from "@/api/types";
export declare function useReportMeta(name: string): UseQueryResult<ReportMeta, Error>;
export declare function useReportExecute(name: string): UseMutationResult<ListResponse<DocRecord>, Error, ReportExecuteRequest>;
