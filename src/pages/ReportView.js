import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useState } from "react";
import { useParams } from "react-router";
import { Loader2Icon, DownloadIcon, ChevronLeftIcon, ChevronRightIcon, } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReportMeta, useReportExecute } from "@/providers/ReportProvider";
import { ReportFilters } from "@/components/report/ReportFilters";
import { ReportTable } from "@/components/report/ReportTable";
import { ReportChart } from "@/components/report/ReportChart";
const PAGE_SIZE = 100;
export function ReportView() {
    const { name = "" } = useParams();
    const { data: meta, isLoading: metaLoading, error: metaError } = useReportMeta(name);
    const executeMutation = useReportExecute(name);
    const [filterValues, setFilterValues] = useState({});
    const [page, setPage] = useState(0);
    const handleRun = useCallback(() => {
        setPage(0);
        const filters = {};
        for (const [k, v] of Object.entries(filterValues)) {
            if (v !== undefined && v !== "")
                filters[k] = v;
        }
        executeMutation.mutate({
            filters,
            limit: PAGE_SIZE,
            offset: 0,
        });
    }, [filterValues, executeMutation]);
    const handlePage = useCallback((newPage) => {
        setPage(newPage);
        const filters = {};
        for (const [k, v] of Object.entries(filterValues)) {
            if (v !== undefined && v !== "")
                filters[k] = v;
        }
        executeMutation.mutate({
            filters,
            limit: PAGE_SIZE,
            offset: newPage * PAGE_SIZE,
        });
    }, [filterValues, executeMutation]);
    if (metaLoading) {
        return (_jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-500", children: [_jsx(Loader2Icon, { className: "size-4 animate-spin" }), "Loading report..."] }));
    }
    if (metaError) {
        return (_jsx("div", { className: "rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700", children: metaError.message }));
    }
    if (!meta)
        return null;
    const rows = executeMutation.data?.data ?? [];
    const total = executeMutation.data?.meta?.total ?? 0;
    const from = total === 0 ? 0 : page * PAGE_SIZE + 1;
    const to = Math.min((page + 1) * PAGE_SIZE, total);
    return (_jsxs("div", { children: [_jsxs("div", { className: "mb-4 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-semibold text-gray-900", children: meta.name }), _jsxs("p", { className: "text-sm text-gray-500", children: ["Report on ", meta.doc_type] })] }), rows.length > 0 && (_jsxs("button", { type: "button", onClick: () => exportCSV(meta.columns, rows), className: "inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50", children: [_jsx(DownloadIcon, { className: "size-3.5" }), "Export CSV"] }))] }), _jsx(ReportFilters, { filters: meta.filters, values: filterValues, onChange: setFilterValues, onRun: handleRun, isLoading: executeMutation.isPending }), meta.chart_config && rows.length > 0 && (_jsx(ReportChart, { config: meta.chart_config, columns: meta.columns, data: rows })), _jsx(ReportTable, { columns: meta.columns, data: rows, isLoading: executeMutation.isPending }), total > 0 && (_jsxs("div", { className: "mt-3 flex items-center justify-between text-sm text-gray-600", children: [_jsxs("span", { children: ["Showing ", from, "\u2013", to, " of ", total] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("button", { type: "button", onClick: () => handlePage(Math.max(0, page - 1)), disabled: page === 0, className: cn("rounded border border-gray-300 p-1", page === 0
                                    ? "cursor-not-allowed opacity-50"
                                    : "hover:bg-gray-50"), children: _jsx(ChevronLeftIcon, { className: "size-4" }) }), _jsx("button", { type: "button", onClick: () => handlePage(page + 1), disabled: to >= total, className: cn("rounded border border-gray-300 p-1", to >= total
                                    ? "cursor-not-allowed opacity-50"
                                    : "hover:bg-gray-50"), children: _jsx(ChevronRightIcon, { className: "size-4" }) })] })] }))] }));
}
function exportCSV(columns, rows) {
    const escape = (v) => {
        if (v.includes(",") || v.includes('"') || v.includes("\n")) {
            return `"${v.replace(/"/g, '""')}"`;
        }
        return v;
    };
    const header = columns.map((c) => escape(c.label)).join(",");
    const lines = rows.map((row) => columns.map((c) => escape(String(row[c.field_name] ?? ""))).join(","));
    const csv = [header, ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "report.csv";
    a.click();
    URL.revokeObjectURL(url);
}
export default ReportView;
