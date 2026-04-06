import { type UseQueryResult } from "@tanstack/react-query";
import type { DashDef } from "@/api/types";
export declare function useDashboardDef(name: string): UseQueryResult<DashDef, Error>;
export declare function useDashboardWidget(name: string, idx: number): UseQueryResult<Record<string, unknown>, Error>;
