import { Loader2Icon, PlayIcon } from "lucide-react";
import type { ReportFilter } from "@/api/types";

interface ReportFiltersProps {
  filters: ReportFilter[];
  values: Record<string, unknown>;
  onChange: (values: Record<string, unknown>) => void;
  onRun: () => void;
  isLoading: boolean;
}

export function ReportFilters({
  filters,
  values,
  onChange,
  onRun,
  isLoading,
}: ReportFiltersProps) {
  const handleChange = (fieldName: string, value: string) => {
    onChange({ ...values, [fieldName]: value || undefined });
  };

  if (filters.length === 0) return null;

  return (
    <div className="mb-4 flex flex-wrap items-end gap-3">
      {filters.map((f) => (
        <div key={f.field_name} className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">
            {f.label}
            {f.required && <span className="text-red-500">*</span>}
          </label>
          {f.field_type === "Select" && typeof f.default === "string" ? (
            <select
              value={String(values[f.field_name] ?? "")}
              onChange={(e) => handleChange(f.field_name, e.target.value)}
              className="rounded border border-gray-300 px-2 py-1.5 text-sm"
            >
              <option value="">All</option>
              {(f.default as string)
                .split("\n")
                .filter(Boolean)
                .map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
            </select>
          ) : f.field_type === "Check" ? (
            <select
              value={String(values[f.field_name] ?? "")}
              onChange={(e) => handleChange(f.field_name, e.target.value)}
              className="rounded border border-gray-300 px-2 py-1.5 text-sm"
            >
              <option value="">All</option>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          ) : f.field_type === "Date" ? (
            <input
              type="date"
              value={String(values[f.field_name] ?? "")}
              onChange={(e) => handleChange(f.field_name, e.target.value)}
              className="rounded border border-gray-300 px-2 py-1.5 text-sm"
            />
          ) : (
            <input
              type="text"
              value={String(values[f.field_name] ?? "")}
              onChange={(e) => handleChange(f.field_name, e.target.value)}
              placeholder={f.label}
              className="w-36 rounded border border-gray-300 px-2 py-1.5 text-sm"
            />
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={onRun}
        disabled={isLoading}
        className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? (
          <Loader2Icon className="size-3.5 animate-spin" />
        ) : (
          <PlayIcon className="size-3.5" />
        )}
        Run Report
      </button>
    </div>
  );
}
