import { jsx as _jsx } from "react/jsx-runtime";
import { Suspense } from "react";
import { FIELD_TYPE_MAP, LAYOUT_TYPES } from "./types";
import { getCustomFieldType } from "@/lib/fieldTypeRegistry";
import StubField from "./StubField";
function FieldSkeleton() {
    return _jsx("div", { className: "h-8 w-full animate-pulse rounded-lg bg-muted" });
}
export function FieldRenderer({ fieldDef, value, onChange, readOnly, error, doc, className, }) {
    if (fieldDef.hidden)
        return null;
    // Three-tier resolution: built-in → custom registry → StubField fallback.
    const Component = FIELD_TYPE_MAP[fieldDef.field_type] ??
        getCustomFieldType(fieldDef.field_type);
    if (!Component) {
        return (_jsx(Suspense, { fallback: _jsx(FieldSkeleton, {}), children: _jsx(StubField, { fieldDef: fieldDef, value: value, onChange: onChange, readOnly: readOnly, error: error, doc: doc, className: className }) }));
    }
    const isLayout = LAYOUT_TYPES.has(fieldDef.field_type);
    if (isLayout) {
        const LayoutComp = Component;
        return (_jsx(Suspense, { fallback: _jsx(FieldSkeleton, {}), children: _jsx(LayoutComp, { fieldDef: fieldDef, className: className }) }));
    }
    return (_jsx(Suspense, { fallback: _jsx(FieldSkeleton, {}), children: _jsx(Component, { fieldDef: fieldDef, value: value, onChange: onChange, readOnly: readOnly ?? fieldDef.read_only, error: error, doc: doc, className: className }) }));
}
export default FieldRenderer;
