import { cn } from "@/lib/utils";

interface FieldDiffProps {
  label: string;
  oldValue: unknown;
  newValue: unknown;
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return "(empty)";
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
}

export function FieldDiff({ label, oldValue, newValue }: FieldDiffProps) {
  const isComplex =
    typeof oldValue === "object" || typeof newValue === "object";
  const Tag = isComplex ? "pre" : "span";

  return (
    <div className="space-y-1">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex flex-col gap-0.5 text-sm">
        <Tag
          className={cn(
            "rounded px-2 py-0.5 break-words",
            "bg-destructive/10 text-destructive",
            isComplex && "overflow-x-auto whitespace-pre-wrap text-xs",
          )}
        >
          {formatValue(oldValue)}
        </Tag>
        <Tag
          className={cn(
            "rounded px-2 py-0.5 break-words",
            "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
            isComplex && "overflow-x-auto whitespace-pre-wrap text-xs",
          )}
        >
          {formatValue(newValue)}
        </Tag>
      </div>
    </div>
  );
}
