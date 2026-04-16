import { Input } from "@/components/ui/input";
import { FieldWrapper } from "./FieldWrapper";
import type { FieldProps } from "./types";

export function CurrencyField({
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
        <span className="pointer-events-none absolute inset-y-0 start-2.5 flex items-center text-sm text-muted-foreground">
          {fieldDef.options || "$"}
        </span>
        <Input
          id={fieldDef.name}
          type="number"
          className="ps-7"
          value={value ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            onChange(v === "" ? (0 as number) : parseFloat(v));
          }}
          readOnly={readOnly}
          disabled={readOnly}
          min={fieldDef.min_value}
          max={fieldDef.max_value}
          step="0.01"
          placeholder="0.00"
          aria-invalid={!!error}
        />
      </div>
    </FieldWrapper>
  );
}

export default CurrencyField;
