import { Suspense } from "react";
import { FIELD_TYPE_MAP, LAYOUT_TYPES } from "./types";
import type { FieldProps } from "./types";

function FieldSkeleton() {
  return <div className="h-8 w-full animate-pulse rounded-lg bg-muted" />;
}

export function FieldRenderer({
  fieldDef,
  value,
  onChange,
  readOnly,
  error,
  doc,
  className,
}: FieldProps) {
  if (fieldDef.hidden) return null;

  const Component = FIELD_TYPE_MAP[fieldDef.field_type];
  if (!Component) return null;

  const isLayout = LAYOUT_TYPES.has(fieldDef.field_type);

  return (
    <Suspense fallback={<FieldSkeleton />}>
      {isLayout ? (
        <Component fieldDef={fieldDef} className={className} />
      ) : (
        <Component
          fieldDef={fieldDef}
          value={value}
          onChange={onChange}
          readOnly={readOnly ?? fieldDef.read_only}
          error={error}
          doc={doc}
          className={className}
        />
      )}
    </Suspense>
  );
}

export default FieldRenderer;
