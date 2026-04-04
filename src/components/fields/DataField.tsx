import { Input } from "@/components/ui/input";
import { FieldWrapper } from "./FieldWrapper";
import type { FieldProps } from "./types";

export function DataField({
  fieldDef,
  value,
  onChange,
  readOnly,
  error,
  className,
}: FieldProps<string>) {
  return (
    <FieldWrapper fieldDef={fieldDef} error={error} className={className}>
      <Input
        id={fieldDef.name}
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        disabled={readOnly}
        maxLength={fieldDef.max_length}
        placeholder={fieldDef.label}
        aria-invalid={!!error}
      />
    </FieldWrapper>
  );
}

export default DataField;
