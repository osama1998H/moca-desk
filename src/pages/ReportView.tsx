import { useCallback, useState } from "react";
import { useParams } from "react-router";
import {
  Loader2Icon,
  DownloadIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useReportMeta, useReportExecute } from "@/providers/ReportProvider";
import { ReportFilters } from "@/components/report/ReportFilters";
import { ReportTable } from "@/components/report/ReportTable";
import { ReportChart } from "@/components/report/ReportChart";
import type { ReportColumn, DocRecord } from "@/api/types";

const PAGE_SIZE = 100;

export function ReportView() {
  const { name = "" } = useParams<{ name: string }>();
  const { data: meta, isLoading: metaLoading, error: metaError } = useReportMeta(name);
  const executeMutation = useReportExecute(name);

  const [filterValues, setFilterValues] = useState<Record<string, unknown>>({});
  const [page, setPage] = useState(0);

  const handleRun = useCallback(() => {
    setPage(0);
    const filters: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(filterValues)) {
      if (v !== undefined && v !== "") filters[k] = v;
    }
    executeMutation.mutate({
      filters,
      limit: PAGE_SIZE,
      offset: 0,
    });
  }, [filterValues, executeMutation]);

  const handlePage = useCallback(
    (newPage: number) => {
      setPage(newPage);
      const filters: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(filterValues)) {
        if (v !== undefined && v !== "") filters[k] = v;
      }
      executeMutation.mutate({
        filters,
        limit: PAGE_SIZE,
        offset: newPage * PAGE_SIZE,
      });
    },
    [filterValues, executeMutation],
  );

  if (metaLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Loader2Icon className="size-4 animate-spin" />
        Loading report...
      </div>
    );
  }

  if (metaError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {metaError.message}
      </div>
    );
  }

  if (!meta) return null;

  const rows = executeMutation.data?.data ?? [];
  const total = executeMutation.data?.meta?.total ?? 0;
  const from = total === 0 ? 0 : page * PAGE_SIZE + 1;
  const to = Math.min((page + 1) * PAGE_SIZE, total);

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{meta.name}</h1>
          <p className="text-sm text-gray-500">
            Report on {meta.doc_type}
          </p>
        </div>
        {rows.length > 0 && (
          <button
            type="button"
            onClick={() => exportCSV(meta.columns, rows)}
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            <DownloadIcon className="size-3.5" />
            Export CSV
          </button>
        )}
      </div>

      {/* Filters */}
      <ReportFilters
        filters={meta.filters}
        values={filterValues}
        onChange={setFilterValues}
        onRun={handleRun}
        isLoading={executeMutation.isPending}
      />

      {/* Chart */}
      {meta.chart_config && rows.length > 0 && (
        <ReportChart
          config={meta.chart_config}
          columns={meta.columns}
          data={rows}
        />
      )}

      {/* Table */}
      <ReportTable
        columns={meta.columns}
        data={rows}
        isLoading={executeMutation.isPending}
      />

      {/* Pagination */}
      {total > 0 && (
        <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {from}–{to} of {total}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handlePage(Math.max(0, page - 1))}
              disabled={page === 0}
              className={cn(
                "rounded border border-gray-300 p-1",
                page === 0
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-gray-50",
              )}
            >
              <ChevronLeftIcon className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => handlePage(page + 1)}
              disabled={to >= total}
              className={cn(
                "rounded border border-gray-300 p-1",
                to >= total
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-gray-50",
              )}
            >
              <ChevronRightIcon className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function exportCSV(columns: ReportColumn[], rows: DocRecord[]) {
  const escape = (v: string) => {
    if (v.includes(",") || v.includes('"') || v.includes("\n")) {
      return `"${v.replace(/"/g, '""')}"`;
    }
    return v;
  };
  const header = columns.map((c) => escape(c.label)).join(",");
  const lines = rows.map((row) =>
    columns.map((c) => escape(String(row[c.field_name] ?? ""))).join(","),
  );
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
