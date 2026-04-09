import { useCallback, useMemo, useState } from "react";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronsUpDownIcon,
  Loader2Icon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReportColumn, DocRecord } from "@/api/types";

interface ReportTableProps {
  columns: ReportColumn[];
  data: DocRecord[];
  isLoading: boolean;
}

export function ReportTable({ columns, data, isLoading }: ReportTableProps) {
  const [sortField, setSortField] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = useCallback(
    (field: string) => {
      if (sortField === field) {
        setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortOrder("asc");
      }
    },
    [sortField],
  );

  const sortedData = useMemo(() => {
    if (!sortField) return data;
    return [...data].sort((a, b) => {
      const av = a[sortField];
      const bv = b[sortField];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      const cmp =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av).localeCompare(String(bv));
      return sortOrder === "asc" ? cmp : -cmp;
    });
  }, [data, sortField, sortOrder]);

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-muted">
            {columns.map((col) => (
              <th
                key={col.field_name}
                className="px-4 py-2.5 font-medium text-foreground"
                style={col.width ? { width: col.width } : undefined}
              >
                <button
                  type="button"
                  onClick={() => handleSort(col.field_name)}
                  className="inline-flex items-center gap-1 hover:text-foreground"
                >
                  {col.label}
                  {sortField === col.field_name ? (
                    sortOrder === "asc" ? (
                      <ChevronUpIcon className="size-3.5" />
                    ) : (
                      <ChevronDownIcon className="size-3.5" />
                    )
                  ) : (
                    <ChevronsUpDownIcon className="size-3.5 text-muted-foreground" />
                  )}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-muted-foreground"
              >
                <Loader2Icon className="mx-auto size-5 animate-spin" />
              </td>
            </tr>
          ) : sortedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-muted-foreground"
              >
                No data. Run the report to see results.
              </td>
            </tr>
          ) : (
            sortedData.map((row, i) => (
              <tr
                key={i}
                className={cn(
                  "border-b border-border",
                  i % 2 === 1 && "bg-muted/50",
                )}
              >
                {columns.map((col) => (
                  <td key={col.field_name} className="px-4 py-2.5 text-foreground">
                    {formatValue(row[col.field_name], col.field_type)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function formatValue(value: unknown, fieldType: string): string {
  if (value == null) return "";
  if (fieldType === "Check") return value ? "Yes" : "No";
  if (fieldType === "Date" && typeof value === "string") return value.slice(0, 10);
  if (typeof value === "number") return value.toLocaleString();
  return String(value);
}
