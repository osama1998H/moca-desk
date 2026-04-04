import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { FieldWrapper } from "./FieldWrapper";
export function StubField({ fieldDef, error, className, }) {
    return (_jsx(FieldWrapper, { fieldDef: fieldDef, error: error, className: className, children: _jsxs("div", { className: "flex h-8 items-center rounded-lg border border-dashed px-2.5 text-sm text-muted-foreground", children: [fieldDef.field_type, " \u2014 not yet implemented"] }) }));
}
export default StubField;
