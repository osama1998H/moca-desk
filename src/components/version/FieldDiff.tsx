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
      <span className="text-xs font-medium text-gray-600">{label}</span>
      <div className="flex flex-col gap-0.5 text-sm">
        <Tag
          className={cn(
            "rounded px-2 py-0.5 break-words",
            "bg-red-50 text-red-800",
            isComplex && "overflow-x-auto whitespace-pre-wrap text-xs",
          )}
        >
          {formatValue(oldValue)}
        </Tag>
        <Tag
          className={cn(
            "rounded px-2 py-0.5 break-words",
            "bg-green-50 text-green-800",
            isComplex && "overflow-x-auto whitespace-pre-wrap text-xs",
          )}
        >
          {formatValue(newValue)}
        </Tag>
      </div>
    </div>
  );
}
