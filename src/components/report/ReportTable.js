import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useMemo, useState } from "react";
import { ChevronUpIcon, ChevronDownIcon, ChevronsUpDownIcon, Loader2Icon, } from "lucide-react";
import { cn } from "@/lib/utils";
export function ReportTable({ columns, data, isLoading }) {
    const [sortField, setSortField] = useState();
    const [sortOrder, setSortOrder] = useState("asc");
    const handleSort = useCallback((field) => {
        if (sortField === field) {
            setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
        }
        else {
            setSortField(field);
            setSortOrder("asc");
        }
    }, [sortField]);
    const sortedData = useMemo(() => {
        if (!sortField)
            return data;
        return [...data].sort((a, b) => {
            const av = a[sortField];
            const bv = b[sortField];
            if (av == null && bv == null)
                return 0;
            if (av == null)
                return 1;
            if (bv == null)
                return -1;
            const cmp = typeof av === "number" && typeof bv === "number"
                ? av - bv
                : String(av).localeCompare(String(bv));
            return sortOrder === "asc" ? cmp : -cmp;
        });
    }, [data, sortField, sortOrder]);
    return (_jsx("div", { className: "overflow-x-auto rounded-lg border border-gray-200 bg-white", children: _jsxs("table", { className: "w-full text-left text-sm", children: [_jsx("thead", { children: _jsx("tr", { className: "border-b border-gray-200 bg-gray-50", children: columns.map((col) => (_jsx("th", { className: "px-4 py-2.5 font-medium text-gray-700", style: col.width ? { width: col.width } : undefined, children: _jsxs("button", { type: "button", onClick: () => handleSort(col.field_name), className: "inline-flex items-center gap-1 hover:text-gray-900", children: [col.label, sortField === col.field_name ? (sortOrder === "asc" ? (_jsx(ChevronUpIcon, { className: "size-3.5" })) : (_jsx(ChevronDownIcon, { className: "size-3.5" }))) : (_jsx(ChevronsUpDownIcon, { className: "size-3.5 text-gray-400" }))] }) }, col.field_name))) }) }), _jsx("tbody", { children: isLoading ? (_jsx("tr", { children: _jsx("td", { colSpan: columns.length, className: "px-4 py-8 text-center text-gray-500", children: _jsx(Loader2Icon, { className: "mx-auto size-5 animate-spin" }) }) })) : sortedData.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: columns.length, className: "px-4 py-8 text-center text-gray-500", children: "No data. Run the report to see results." }) })) : (sortedData.map((row, i) => (_jsx("tr", { className: cn("border-b border-gray-100", i % 2 === 1 && "bg-gray-50/50"), children: columns.map((col) => (_jsx("td", { className: "px-4 py-2.5 text-gray-700", children: formatValue(row[col.field_name], col.field_type) }, col.field_name))) }, i)))) })] }) }));
}
function formatValue(value, fieldType) {
    if (value == null)
        return "";
    if (fieldType === "Check")
        return value ? "Yes" : "No";
    if (fieldType === "Date" && typeof value === "string")
        return value.slice(0, 10);
    if (typeof value === "number")
        return value.toLocaleString();
    return String(value);
}
