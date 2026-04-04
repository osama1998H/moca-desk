import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FieldWrapper } from "./FieldWrapper";
import type { FieldProps } from "./types";

export function ColorField({
  fieldDef,
  value,
  onChange,
  readOnly,
  error,
  className,
}: FieldProps<string>) {
  const color = (value as string) || "#000000";

  return (
    <FieldWrapper fieldDef={fieldDef} error={error} className={className}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          disabled={readOnly}
          className={cn(
            "size-8 cursor-pointer rounded-lg border border-input p-0.5",
            readOnly && "cursor-not-allowed opacity-50",
          )}
        />
        <Input
          id={fieldDef.name}
          value={color}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly}
          disabled={readOnly}
          maxLength={7}
          className="w-28"
          aria-invalid={!!error}
        />
      </div>
    </FieldWrapper>
  );
}

export default ColorField;
