import { useQuery, useMutation, useQueryClient, } from "@tanstack/react-query";
import { get, post, put, del } from "@/api/client";
// ── List ────────────────────────────────────────────────────────────────────
export function useDocList(doctype, options) {
    const params = {};
    if (options?.limit !== undefined)
        params["limit"] = String(options.limit);
    if (options?.offset !== undefined)
        params["offset"] = String(options.offset);
    if (options?.order_by)
        params["order_by"] = options.order_by;
    if (options?.fields)
        params["fields"] = JSON.stringify(options.fields);
    if (options?.filters)
        params["filters"] = JSON.stringify(options.filters);
    return useQuery({
        queryKey: ["docList", doctype, options ?? {}],
        queryFn: () => get(`resource/${doctype}`, params),
        enabled: doctype.length > 0,
    });
}
// ── Single document ─────────────────────────────────────────────────────────
export function useDocument(doctype, name) {
    return useQuery({
        queryKey: ["doc", doctype, name],
        queryFn: async () => {
            const res = await get(`resource/${doctype}/${encodeURIComponent(name)}`);
            return res.data;
        },
        enabled: doctype.length > 0 && name.length > 0,
    });
}
// ── Create ──────────────────────────────────────────────────────────────────
export function useDocCreate(doctype) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const res = await post(`resource/${doctype}`, data);
            return res.data;
        },
        onSuccess: () => {
            void qc.invalidateQueries({ queryKey: ["docList", doctype] });
        },
    });
}
// ── Update ──────────────────────────────────────────────────────────────────
export function useDocUpdate(doctype, name) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const res = await put(`resource/${doctype}/${encodeURIComponent(name)}`, data);
            return res.data;
        },
        onSuccess: (data) => {
            qc.setQueryData(["doc", doctype, name], data);
            void qc.invalidateQueries({ queryKey: ["docList", doctype] });
        },
    });
}
// ── Delete ──────────────────────────────────────────────────────────────────
export function useDocDelete(doctype, name) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: () => del(`resource/${doctype}/${encodeURIComponent(name)}`),
        onSuccess: () => {
            qc.removeQueries({ queryKey: ["doc", doctype, name] });
            void qc.invalidateQueries({ queryKey: ["docList", doctype] });
        },
    });
}
