import { Input } from "@/components/ui/input";
import { FieldWrapper } from "./FieldWrapper";
import type { FieldProps } from "./types";

export function PercentField({
  fieldDef,
  value,
  onChange,
  readOnly,
  error,
  className,
}: FieldProps<number>) {
  return (
    <FieldWrapper fieldDef={fieldDef} error={error} className={className}>
      <div className="relative">
        <Input
          id={fieldDef.name}
          type="number"
          className="pe-7"
          value={value ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            onChange(v === "" ? (0 as number) : parseFloat(v));
          }}
          readOnly={readOnly}
          disabled={readOnly}
          min={fieldDef.min_value ?? 0}
          max={fieldDef.max_value ?? 100}
          step="any"
          placeholder="0"
          aria-invalid={!!error}
        />
        <span className="pointer-events-none absolute inset-y-0 end-2.5 flex items-center text-sm text-muted-foreground">
          %
        </span>
      </div>
    </FieldWrapper>
  );
}

export default PercentField;
