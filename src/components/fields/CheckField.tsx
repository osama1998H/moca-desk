import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { FieldProps } from "./types";

export function CheckField({
  fieldDef,
  value,
  onChange,
  readOnly,
  error,
  className,
}: FieldProps<boolean | number>) {
  const checked = value === true || value === 1;

  return (
    <div
      className={cn("flex items-center gap-2", className)}
      data-invalid={error ? true : undefined}
    >
      <Checkbox
        id={fieldDef.name}
        checked={checked}
        onCheckedChange={(v) => onChange(v === true ? 1 : 0)}
        disabled={readOnly}
        aria-invalid={!!error}
      />
      {fieldDef.label && (
        <Label htmlFor={fieldDef.name} className="cursor-pointer">
          {fieldDef.label}
          {fieldDef.required && (
            <span className="text-destructive">*</span>
          )}
        </Label>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export default CheckField;
