import { Input } from "@/components/ui/input";
import { FieldWrapper } from "./FieldWrapper";
import type { FieldProps } from "./types";

export function IntField({
  fieldDef,
  value,
  onChange,
  readOnly,
  error,
  className,
}: FieldProps<number>) {
  return (
    <FieldWrapper fieldDef={fieldDef} error={error} className={className}>
      <Input
        id={fieldDef.name}
        type="number"
        value={value ?? ""}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === "" ? (0 as number) : parseInt(v, 10));
        }}
        readOnly={readOnly}
        disabled={readOnly}
        min={fieldDef.min_value}
        max={fieldDef.max_value}
        step={1}
        placeholder={fieldDef.label}
        aria-invalid={!!error}
      />
    </FieldWrapper>
  );
}

export default IntField;
