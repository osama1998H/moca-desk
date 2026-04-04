import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import type { FieldDef } from "@/api/types";

interface FieldWrapperProps {
  fieldDef: FieldDef;
  error?: string;
  className?: string;
  children: React.ReactNode;
}

export function FieldWrapper({
  fieldDef,
  error,
  className,
  children,
}: FieldWrapperProps) {
  const colSpan = fieldDef.col_span;

  return (
    <div
      className={cn(
        "flex flex-col gap-1.5",
        colSpan && `col-span-${String(colSpan)}`,
        className,
      )}
      data-invalid={error ? true : undefined}
      data-disabled={fieldDef.read_only ? true : undefined}
    >
      {fieldDef.label && (
        <Label htmlFor={fieldDef.name}>
          {fieldDef.label}
          {fieldDef.required && (
            <span className="text-destructive">*</span>
          )}
        </Label>
      )}
      {children}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}

export default FieldWrapper;
