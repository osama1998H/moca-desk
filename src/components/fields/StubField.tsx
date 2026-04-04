import { FieldWrapper } from "./FieldWrapper";
import type { FieldProps } from "./types";

export function StubField({
  fieldDef,
  error,
  className,
}: FieldProps) {
  return (
    <FieldWrapper fieldDef={fieldDef} error={error} className={className}>
      <div className="flex h-8 items-center rounded-lg border border-dashed px-2.5 text-sm text-muted-foreground">
        {fieldDef.field_type} &mdash; not yet implemented
      </div>
    </FieldWrapper>
  );
}

export default StubField;
