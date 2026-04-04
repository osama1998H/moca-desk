import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FieldWrapper } from "./FieldWrapper";
export function ColorField({ fieldDef, value, onChange, readOnly, error, className, }) {
    const color = value || "#000000";
    return (_jsx(FieldWrapper, { fieldDef: fieldDef, error: error, className: className, children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "color", value: color, onChange: (e) => onChange(e.target.value), disabled: readOnly, className: cn("size-8 cursor-pointer rounded-lg border border-input p-0.5", readOnly && "cursor-not-allowed opacity-50") }), _jsx(Input, { id: fieldDef.name, value: color, onChange: (e) => onChange(e.target.value), readOnly: readOnly, disabled: readOnly, maxLength: 7, className: "w-28", "aria-invalid": !!error })] }) }));
}
export default ColorField;
