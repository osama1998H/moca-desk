import { useCallback, useState } from "react";
import { useParams } from "react-router";
import {
  Loader2Icon,
  DownloadIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2Icon className="size-4 animate-spin" />
        Loading report...
      </div>
    );
  }

  if (metaError) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">{meta.name}</h1>
          <p className="text-sm text-muted-foreground">
            Report on {meta.doc_type}
          </p>
        </div>
        {rows.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportCSV(meta.columns, rows)}
          >
            <DownloadIcon data-icon="inline-start" />
            Export CSV
          </Button>
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
        <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {from}–{to} of {total}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-xs"
              onClick={() => handlePage(Math.max(0, page - 1))}
              disabled={page === 0}
            >
              <ChevronLeftIcon />
            </Button>
            <Button
              variant="outline"
              size="icon-xs"
              onClick={() => handlePage(page + 1)}
              disabled={to >= total}
            >
              <ChevronRightIcon />
            </Button>
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
