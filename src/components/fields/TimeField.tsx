import { Input } from "@/components/ui/input";
import { FieldWrapper } from "./FieldWrapper";
import type { FieldProps } from "./types";

export function TimeField({
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
        type="time"
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        disabled={readOnly}
        placeholder="HH:MM"
        aria-invalid={!!error}
      />
    </FieldWrapper>
  );
}

export default TimeField;
