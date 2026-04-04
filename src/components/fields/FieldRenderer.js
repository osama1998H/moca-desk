import { jsx as _jsx } from "react/jsx-runtime";
import { Suspense } from "react";
import { FIELD_TYPE_MAP, LAYOUT_TYPES } from "./types";
function FieldSkeleton() {
    return _jsx("div", { className: "h-8 w-full animate-pulse rounded-lg bg-muted" });
}
export function FieldRenderer({ fieldDef, value, onChange, readOnly, error, doc, className, }) {
    if (fieldDef.hidden)
        return null;
    const Component = FIELD_TYPE_MAP[fieldDef.field_type];
    if (!Component)
        return null;
    const isLayout = LAYOUT_TYPES.has(fieldDef.field_type);
    return (_jsx(Suspense, { fallback: _jsx(FieldSkeleton, {}), children: isLayout ? (_jsx(Component, { fieldDef: fieldDef, className: className })) : (_jsx(Component, { fieldDef: fieldDef, value: value, onChange: onChange, readOnly: readOnly ?? fieldDef.read_only, error: error, doc: doc, className: className })) }));
}
export default FieldRenderer;
