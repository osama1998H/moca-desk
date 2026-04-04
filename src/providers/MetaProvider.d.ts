import { type UseQueryResult } from "@tanstack/react-query";
import type { MetaType } from "@/api/types";
export declare function useMetaType(doctype: string): UseQueryResult<MetaType, Error>;
