import { Textarea } from "@/components/ui/textarea";
import { FieldWrapper } from "./FieldWrapper";
import type { FieldProps } from "./types";

export function TextField({
  fieldDef,
  value,
  onChange,
  readOnly,
  error,
  className,
}: FieldProps<string>) {
  return (
    <FieldWrapper fieldDef={fieldDef} error={error} className={className}>
      <Textarea
        id={fieldDef.name}
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        disabled={readOnly}
        maxLength={fieldDef.max_length}
        rows={3}
        placeholder={fieldDef.label}
        aria-invalid={!!error}
      />
    </FieldWrapper>
  );
}

export default TextField;
