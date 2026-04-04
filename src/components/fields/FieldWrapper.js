import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
export function FieldWrapper({ fieldDef, error, className, children, }) {
    const colSpan = fieldDef.col_span;
    return (_jsxs("div", { className: cn("flex flex-col gap-1.5", colSpan && `col-span-${String(colSpan)}`, className), "data-invalid": error ? true : undefined, "data-disabled": fieldDef.read_only ? true : undefined, children: [fieldDef.label && (_jsxs(Label, { htmlFor: fieldDef.name, children: [fieldDef.label, fieldDef.required && (_jsx("span", { className: "text-destructive", children: "*" }))] })), children, error && (_jsx("p", { className: "text-xs text-destructive", children: error }))] }));
}
export default FieldWrapper;
