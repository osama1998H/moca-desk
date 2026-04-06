import { Suspense } from "react";
import { FIELD_TYPE_MAP, LAYOUT_TYPES } from "./types";
import type { FieldProps, LayoutFieldProps } from "./types";
import { getCustomFieldType } from "@/lib/fieldTypeRegistry";
import StubField from "./StubField";

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

  // Three-tier resolution: built-in → custom registry → StubField fallback.
  const Component =
    FIELD_TYPE_MAP[fieldDef.field_type] ??
    getCustomFieldType(fieldDef.field_type);

  if (!Component) {
    return (
      <Suspense fallback={<FieldSkeleton />}>
        <StubField
          fieldDef={fieldDef}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          error={error}
          doc={doc}
          className={className}
        />
      </Suspense>
    );
  }

  const isLayout = LAYOUT_TYPES.has(fieldDef.field_type);

  if (isLayout) {
    const LayoutComp = Component as React.ComponentType<LayoutFieldProps>;
    return (
      <Suspense fallback={<FieldSkeleton />}>
        <LayoutComp fieldDef={fieldDef} className={className} />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<FieldSkeleton />}>
      <Component
        fieldDef={fieldDef}
        value={value}
        onChange={onChange}
        readOnly={readOnly ?? fieldDef.read_only}
        error={error}
        doc={doc}
        className={className}
      />
    </Suspense>
  );
}

export default FieldRenderer;
