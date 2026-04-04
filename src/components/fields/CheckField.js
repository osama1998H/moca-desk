import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
export function CheckField({ fieldDef, value, onChange, readOnly, error, className, }) {
    const checked = value === true || value === 1;
    return (_jsxs("div", { className: cn("flex items-center gap-2", className), "data-invalid": error ? true : undefined, children: [_jsx(Checkbox, { id: fieldDef.name, checked: checked, onCheckedChange: (v) => onChange(v === true ? 1 : 0), disabled: readOnly, "aria-invalid": !!error }), fieldDef.label && (_jsxs(Label, { htmlFor: fieldDef.name, className: "cursor-pointer", children: [fieldDef.label, fieldDef.required && (_jsx("span", { className: "text-destructive", children: "*" }))] })), error && _jsx("p", { className: "text-xs text-destructive", children: error })] }));
}
export default CheckField;
