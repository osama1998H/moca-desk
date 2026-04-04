import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useCallback, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useMetaType } from "@/providers/MetaProvider";
import { useDocList } from "@/providers/DocProvider";
import { usePermissions } from "@/providers/PermissionProvider";
import { LAYOUT_TYPES } from "@/components/fields/types";
import { cn } from "@/lib/utils";
import { PlusIcon, ChevronUpIcon, ChevronDownIcon, ChevronsUpDownIcon, ChevronLeftIcon, ChevronRightIcon, Loader2Icon, } from "lucide-react";
const DEFAULT_PAGE_SIZE = 20;
// ── Filter bar ─────────────────────────────────────────────────────────────
function FilterBar({ filterFields, onApply, }) {
    const [values, setValues] = useState({});
    const handleChange = (fieldName, value) => {
        const next = { ...values, [fieldName]: value };
        setValues(next);
        // Build filters from non-empty values
        const filters = [];
        for (const f of filterFields) {
            const v = next[f.name];
            if (!v)
                continue;
            if (f.field_type === "Select" ||
                f.field_type === "Link" ||
                f.field_type === "Check") {
                filters.push([f.name, "=", v]);
            }
            else {
                filters.push([f.name, "like", `%${v}%`]);
            }
        }
        onApply(filters);
    };
    if (filterFields.length === 0)
        return null;
    return (_jsx("div", { className: "mb-4 flex flex-wrap items-center gap-2", children: filterFields.map((f) => (_jsxs("div", { className: "flex items-center gap-1", children: [_jsxs("label", { className: "text-xs text-gray-500", children: [f.label, ":"] }), f.field_type === "Select" && f.options ? (_jsxs("select", { value: values[f.name] ?? "", onChange: (e) => handleChange(f.name, e.target.value), className: "rounded border border-gray-300 px-2 py-1 text-sm", children: [_jsx("option", { value: "", children: "All" }), f.options.split("\n").map((opt) => (_jsx("option", { value: opt, children: opt }, opt)))] })) : f.field_type === "Check" ? (_jsxs("select", { value: values[f.name] ?? "", onChange: (e) => handleChange(f.name, e.target.value), className: "rounded border border-gray-300 px-2 py-1 text-sm", children: [_jsx("option", { value: "", children: "All" }), _jsx("option", { value: "1", children: "Yes" }), _jsx("option", { value: "0", children: "No" })] })) : (_jsx("input", { type: "text", value: values[f.name] ?? "", onChange: (e) => handleChange(f.name, e.target.value), placeholder: f.label, className: "w-32 rounded border border-gray-300 px-2 py-1 text-sm" }))] }, f.name))) }));
}
// ── Sort icon ──────────────────────────────────────────────────────────────
function SortIcon({ field, sortField, sortOrder, }) {
    if (sortField !== field) {
        return _jsx(ChevronsUpDownIcon, { className: "size-3.5 text-gray-400" });
    }
    return sortOrder === "asc" ? (_jsx(ChevronUpIcon, { className: "size-3.5" })) : (_jsx(ChevronDownIcon, { className: "size-3.5" }));
}
// ── Component ──────────────────────────────────────────────────────────────
export function ListView() {
    const { doctype = "" } = useParams();
    const navigate = useNavigate();
    const { data: meta, isLoading: metaLoading, error: metaError } = useMetaType(doctype);
    const { canCreate } = usePermissions(doctype);
    const [filters, setFilters] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize] = useState(DEFAULT_PAGE_SIZE);
    const [sortField, setSortField] = useState(undefined);
    const [sortOrder, setSortOrder] = useState("desc");
    // Derive visible columns from meta
    const visibleColumns = useMemo(() => {
        if (!meta)
            return [];
        const cols = meta.fields.filter((f) => f.in_list_view && !LAYOUT_TYPES.has(f.field_type));
        // Ensure "name" is included
        if (!cols.some((c) => c.name === "name")) {
            cols.unshift({
                name: "name",
                field_type: "Data",
                label: "ID",
                required: false,
                read_only: true,
                in_api: true,
            });
        }
        return cols;
    }, [meta]);
    // Derive filter fields
    const filterFields = useMemo(() => {
        if (!meta)
            return [];
        return meta.fields.filter((f) => f.in_filter && !LAYOUT_TYPES.has(f.field_type));
    }, [meta]);
    // Determine sort
    const effectiveSortField = sortField ?? meta?.sort_field ?? "modified";
    const effectiveSortOrder = sortField ? sortOrder : meta?.sort_order ?? "desc";
    const orderBy = `${effectiveSortField} ${effectiveSortOrder}`;
    // Fields to request from API
    const requestFields = useMemo(() => [...new Set(["name", ...visibleColumns.map((c) => c.name)])], [visibleColumns]);
    const { data: listData, isLoading: listLoading } = useDocList(doctype, {
        fields: requestFields,
        filters,
        limit: pageSize,
        offset: page * pageSize,
        order_by: orderBy,
    });
    // Sort toggle
    const handleSort = useCallback((field) => {
        if (sortField === field) {
            setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
        }
        else {
            setSortField(field);
            setSortOrder("asc");
        }
        setPage(0);
    }, [sortField]);
    // Filter change
    const handleFilters = useCallback((f) => {
        setFilters(f);
        setPage(0);
    }, []);
    // ── Loading / Error ────────────────────────────────────────────────────
    if (metaLoading) {
        return (_jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-500", children: [_jsx(Loader2Icon, { className: "size-4 animate-spin" }), "Loading..."] }));
    }
    if (metaError) {
        return (_jsx("div", { className: "rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700", children: metaError.message }));
    }
    if (!meta)
        return null;
    const rows = listData?.data ?? [];
    const total = listData?.meta?.total ?? 0;
    const from = total === 0 ? 0 : page * pageSize + 1;
    const to = Math.min((page + 1) * pageSize, total);
    return (_jsxs("div", { children: [_jsxs("div", { className: "mb-4 flex items-center justify-between", children: [_jsx("h1", { className: "text-xl font-semibold text-gray-900", children: meta.label || doctype }), canCreate && (_jsxs(Link, { to: `/desk/app/${doctype}/new`, className: "inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700", children: [_jsx(PlusIcon, { className: "size-3.5" }), "New"] }))] }), _jsx(FilterBar, { filterFields: filterFields, onApply: handleFilters }), _jsx("div", { className: "overflow-x-auto rounded-lg border border-gray-200 bg-white", children: _jsxs("table", { className: "w-full text-left text-sm", children: [_jsx("thead", { children: _jsx("tr", { className: "border-b border-gray-200 bg-gray-50", children: visibleColumns.map((col) => (_jsx("th", { className: "px-4 py-2.5 font-medium text-gray-700", children: _jsxs("button", { type: "button", onClick: () => handleSort(col.name), className: "inline-flex items-center gap-1 hover:text-gray-900", children: [col.label, _jsx(SortIcon, { field: col.name, sortField: effectiveSortField, sortOrder: effectiveSortOrder })] }) }, col.name))) }) }), _jsx("tbody", { children: listLoading ? (_jsx("tr", { children: _jsx("td", { colSpan: visibleColumns.length, className: "px-4 py-8 text-center text-gray-500", children: _jsx(Loader2Icon, { className: "mx-auto size-5 animate-spin" }) }) })) : rows.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: visibleColumns.length, className: "px-4 py-8 text-center text-gray-500", children: "No records found" }) })) : (rows.map((row) => (_jsx("tr", { onClick: () => navigate(`/desk/app/${doctype}/${encodeURIComponent(String(row.name))}`), className: "cursor-pointer border-b border-gray-100 hover:bg-gray-50", children: visibleColumns.map((col) => (_jsx("td", { className: "px-4 py-2.5 text-gray-700", children: formatCellValue(row[col.name], col) }, col.name))) }, String(row.name))))) })] }) }), total > 0 && (_jsxs("div", { className: "mt-3 flex items-center justify-between text-sm text-gray-600", children: [_jsxs("span", { children: ["Showing ", from, "\u2013", to, " of ", total] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("button", { type: "button", onClick: () => setPage((p) => Math.max(0, p - 1)), disabled: page === 0, className: cn("rounded border border-gray-300 p-1", page === 0
                                    ? "cursor-not-allowed opacity-50"
                                    : "hover:bg-gray-50"), children: _jsx(ChevronLeftIcon, { className: "size-4" }) }), _jsx("button", { type: "button", onClick: () => setPage((p) => p + 1), disabled: to >= total, className: cn("rounded border border-gray-300 p-1", to >= total
                                    ? "cursor-not-allowed opacity-50"
                                    : "hover:bg-gray-50"), children: _jsx(ChevronRightIcon, { className: "size-4" }) })] })] }))] }));
}
// ── Cell formatter ─────────────────────────────────────────────────────────
function formatCellValue(value, field) {
    if (value == null)
        return "";
    if (field.field_type === "Check")
        return value ? "Yes" : "No";
    if (field.field_type === "Date" && typeof value === "string") {
        return value.slice(0, 10);
    }
    return String(value);
}
export default ListView;
