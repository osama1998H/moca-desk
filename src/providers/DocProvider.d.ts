import { type UseQueryResult, type UseMutationResult } from "@tanstack/react-query";
import type { DocRecord, ListOptions, ListResponse } from "@/api/types";
export declare function useDocList(doctype: string, options?: ListOptions): UseQueryResult<ListResponse<DocRecord>, Error>;
export declare function useDocument(doctype: string, name: string): UseQueryResult<DocRecord, Error>;
export declare function useDocCreate(doctype: string): UseMutationResult<DocRecord, Error, DocRecord>;
export declare function useDocUpdate(doctype: string, name: string): UseMutationResult<DocRecord, Error, DocRecord>;
export declare function useDocDelete(doctype: string, name: string): UseMutationResult<void, Error, void>;
