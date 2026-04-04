import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from "@tanstack/react-query";
import { get, post, put, del } from "@/api/client";
import type {
  ApiResponse,
  DocRecord,
  ListOptions,
  ListResponse,
} from "@/api/types";

// ── List ────────────────────────────────────────────────────────────────────

export function useDocList(
  doctype: string,
  options?: ListOptions,
): UseQueryResult<ListResponse<DocRecord>, Error> {
  const params: Record<string, string> = {};
  if (options?.limit !== undefined) params["limit"] = String(options.limit);
  if (options?.offset !== undefined) params["offset"] = String(options.offset);
  if (options?.order_by) params["order_by"] = options.order_by;
  if (options?.fields) params["fields"] = JSON.stringify(options.fields);
  if (options?.filters) params["filters"] = JSON.stringify(options.filters);

  return useQuery({
    queryKey: ["docList", doctype, options ?? {}],
    queryFn: () => get<ListResponse<DocRecord>>(`resource/${doctype}`, params),
    enabled: doctype.length > 0,
  });
}

// ── Single document ─────────────────────────────────────────────────────────

export function useDocument(
  doctype: string,
  name: string,
): UseQueryResult<DocRecord, Error> {
  return useQuery({
    queryKey: ["doc", doctype, name],
    queryFn: async () => {
      const res = await get<ApiResponse<DocRecord>>(
        `resource/${doctype}/${encodeURIComponent(name)}`,
      );
      return res.data;
    },
    enabled: doctype.length > 0 && name.length > 0,
  });
}

// ── Create ──────────────────────────────────────────────────────────────────

export function useDocCreate(
  doctype: string,
): UseMutationResult<DocRecord, Error, DocRecord> {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: DocRecord) => {
      const res = await post<ApiResponse<DocRecord>>(
        `resource/${doctype}`,
        data,
      );
      return res.data;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["docList", doctype] });
    },
  });
}

// ── Update ──────────────────────────────────────────────────────────────────

export function useDocUpdate(
  doctype: string,
  name: string,
): UseMutationResult<DocRecord, Error, DocRecord> {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: DocRecord) => {
      const res = await put<ApiResponse<DocRecord>>(
        `resource/${doctype}/${encodeURIComponent(name)}`,
        data,
      );
      return res.data;
    },
    onSuccess: (data) => {
      qc.setQueryData(["doc", doctype, name], data);
      void qc.invalidateQueries({ queryKey: ["docList", doctype] });
    },
  });
}

// ── Delete ──────────────────────────────────────────────────────────────────

export function useDocDelete(
  doctype: string,
  name: string,
): UseMutationResult<void, Error, void> {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () =>
      del(`resource/${doctype}/${encodeURIComponent(name)}`),
    onSuccess: () => {
      qc.removeQueries({ queryKey: ["doc", doctype, name] });
      void qc.invalidateQueries({ queryKey: ["docList", doctype] });
    },
  });
}
