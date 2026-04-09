import { Loader2Icon, PlayIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
          <label className="text-xs font-medium text-muted-foreground">
            {f.label}
            {f.required && <span className="text-destructive">*</span>}
          </label>
          {f.field_type === "Select" && typeof f.default === "string" ? (
            <select
              value={String(values[f.field_name] ?? "")}
              onChange={(e) => handleChange(f.field_name, e.target.value)}
              className="h-8 rounded-md border border-input bg-background px-2.5 text-sm ring-ring/50 focus:border-ring focus:ring-3"
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
              className="h-8 rounded-md border border-input bg-background px-2.5 text-sm ring-ring/50 focus:border-ring focus:ring-3"
            >
              <option value="">All</option>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          ) : f.field_type === "Date" ? (
            <Input
              type="date"
              value={String(values[f.field_name] ?? "")}
              onChange={(e) => handleChange(f.field_name, e.target.value)}
            />
          ) : (
            <Input
              type="text"
              value={String(values[f.field_name] ?? "")}
              onChange={(e) => handleChange(f.field_name, e.target.value)}
              placeholder={f.label}
              className="w-36"
            />
          )}
        </div>
      ))}
      <Button size="sm" onClick={onRun} disabled={isLoading}>
        {isLoading ? (
          <Loader2Icon data-icon="inline-start" className="animate-spin" />
        ) : (
          <PlayIcon data-icon="inline-start" />
        )}
        Run Report
      </Button>
    </div>
  );
}
