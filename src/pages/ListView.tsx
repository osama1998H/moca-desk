import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useMetaType } from "@/providers/MetaProvider";
import { useDocList } from "@/providers/DocProvider";
import { usePermissions } from "@/providers/PermissionProvider";
import { useWebSocket } from "@/providers/WebSocketProvider";
import { LAYOUT_TYPES } from "@/components/fields/types";
import type { FieldDef, FilterTuple } from "@/api/types";
import { cn } from "@/lib/utils";
import {
  PlusIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronsUpDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Loader2Icon,
} from "lucide-react";

const DEFAULT_PAGE_SIZE = 20;

// ── Filter bar ─────────────────────────────────────────────────────────────

function FilterBar({
  filterFields,
  onApply,
}: {
  filterFields: FieldDef[];
  onApply: (filters: FilterTuple[]) => void;
}) {
  const [values, setValues] = useState<Record<string, string>>({});

  const handleChange = (fieldName: string, value: string) => {
    const next = { ...values, [fieldName]: value };
    setValues(next);

    // Build filters from non-empty values
    const filters: FilterTuple[] = [];
    for (const f of filterFields) {
      const v = next[f.name];
      if (!v) continue;
      if (
        f.field_type === "Select" ||
        f.field_type === "Link" ||
        f.field_type === "Check"
      ) {
        filters.push([f.name, "=", v]);
      } else {
        filters.push([f.name, "like", `%${v}%`]);
      }
    }
    onApply(filters);
  };

  if (filterFields.length === 0) return null;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {filterFields.map((f) => (
        <div key={f.name} className="flex items-center gap-1">
          <label className="text-xs text-gray-500">{f.label}:</label>
          {f.field_type === "Select" && f.options ? (
            <select
              value={values[f.name] ?? ""}
              onChange={(e) => handleChange(f.name, e.target.value)}
              className="rounded border border-gray-300 px-2 py-1 text-sm"
            >
              <option value="">All</option>
              {f.options.split("\n").map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : f.field_type === "Check" ? (
            <select
              value={values[f.name] ?? ""}
              onChange={(e) => handleChange(f.name, e.target.value)}
              className="rounded border border-gray-300 px-2 py-1 text-sm"
            >
              <option value="">All</option>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          ) : (
            <input
              type="text"
              value={values[f.name] ?? ""}
              onChange={(e) => handleChange(f.name, e.target.value)}
              placeholder={f.label}
              className="w-32 rounded border border-gray-300 px-2 py-1 text-sm"
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Sort icon ──────────────────────────────────────────────────────────────

function SortIcon({
  field,
  sortField,
  sortOrder,
}: {
  field: string;
  sortField: string | undefined;
  sortOrder: "asc" | "desc";
}) {
  if (sortField !== field) {
    return <ChevronsUpDownIcon className="size-3.5 text-gray-400" />;
  }
  return sortOrder === "asc" ? (
    <ChevronUpIcon className="size-3.5" />
  ) : (
    <ChevronDownIcon className="size-3.5" />
  );
}

// ── Component ──────────────────────────────────────────────────────────────

export function ListView() {
  const { doctype = "" } = useParams<{ doctype: string }>();
  const navigate = useNavigate();

  const { data: meta, isLoading: metaLoading, error: metaError } = useMetaType(doctype);
  const { canCreate } = usePermissions(doctype);
  const { subscribe } = useWebSocket();
  const queryClient = useQueryClient();

  // Real-time: silently refresh list when documents change.
  useEffect(() => {
    if (!doctype) return;
    return subscribe(doctype, () => {
      void queryClient.invalidateQueries({ queryKey: ["docList", doctype] });
    });
  }, [doctype, subscribe, queryClient]);

  const [filters, setFilters] = useState<FilterTuple[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortField, setSortField] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Derive visible columns from meta
  const visibleColumns = useMemo<FieldDef[]>(() => {
    if (!meta) return [];
    const cols = meta.fields.filter(
      (f) => f.in_list_view && !LAYOUT_TYPES.has(f.field_type),
    );
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
  const filterFields = useMemo<FieldDef[]>(() => {
    if (!meta) return [];
    return meta.fields.filter(
      (f) => f.in_filter && !LAYOUT_TYPES.has(f.field_type),
    );
  }, [meta]);

  // Determine sort
  const effectiveSortField = sortField ?? meta?.sort_field ?? "modified";
  const effectiveSortOrder = sortField ? sortOrder : (meta?.sort_order as "asc" | "desc") ?? "desc";
  const orderBy = `${effectiveSortField} ${effectiveSortOrder}`;

  // Fields to request from API
  const requestFields = useMemo(
    () => [...new Set(["name", ...visibleColumns.map((c) => c.name)])],
    [visibleColumns],
  );

  const { data: listData, isLoading: listLoading } = useDocList(doctype, {
    fields: requestFields,
    filters,
    limit: pageSize,
    offset: page * pageSize,
    order_by: orderBy,
  });

  // Sort toggle
  const handleSort = useCallback(
    (field: string) => {
      if (sortField === field) {
        setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortOrder("asc");
      }
      setPage(0);
    },
    [sortField],
  );

  // Filter change
  const handleFilters = useCallback((f: FilterTuple[]) => {
    setFilters(f);
    setPage(0);
  }, []);

  // ── Loading / Error ────────────────────────────────────────────────────

  if (metaLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Loader2Icon className="size-4 animate-spin" />
        Loading...
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

  const rows = listData?.data ?? [];
  const total = listData?.meta?.total ?? 0;
  const from = total === 0 ? 0 : page * pageSize + 1;
  const to = Math.min((page + 1) * pageSize, total);

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">
          {meta.label || doctype}
        </h1>
        {canCreate && (
          <Link
            to={`/desk/app/${doctype}/new`}
            className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
          >
            <PlusIcon className="size-3.5" />
            New
          </Link>
        )}
      </div>

      {/* Filter bar */}
      <FilterBar filterFields={filterFields} onApply={handleFilters} />

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {visibleColumns.map((col) => (
                <th
                  key={col.name}
                  className="px-4 py-2.5 font-medium text-gray-700"
                >
                  <button
                    type="button"
                    onClick={() => handleSort(col.name)}
                    className="inline-flex items-center gap-1 hover:text-gray-900"
                  >
                    {col.label}
                    <SortIcon
                      field={col.name}
                      sortField={effectiveSortField}
                      sortOrder={effectiveSortOrder}
                    />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {listLoading ? (
              <tr>
                <td
                  colSpan={visibleColumns.length}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  <Loader2Icon className="mx-auto size-5 animate-spin" />
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumns.length}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  No records found
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={String(row.name)}
                  onClick={() =>
                    navigate(
                      `/desk/app/${doctype}/${encodeURIComponent(String(row.name))}`,
                    )
                  }
                  className="cursor-pointer border-b border-gray-100 hover:bg-gray-50"
                >
                  {visibleColumns.map((col) => (
                    <td key={col.name} className="px-4 py-2.5 text-gray-700">
                      {formatCellValue(row[col.name], col)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > 0 && (
        <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {from}–{to} of {total}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
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
              onClick={() => setPage((p) => p + 1)}
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

// ── Cell formatter ─────────────────────────────────────────────────────────

function formatCellValue(value: unknown, field: FieldDef): string {
  if (value == null) return "";
  if (field.field_type === "Check") return value ? "Yes" : "No";
  if (field.field_type === "Date" && typeof value === "string") {
    return value.slice(0, 10);
  }
  return String(value);
}

export default ListView;
