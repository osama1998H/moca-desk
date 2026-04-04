import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Input } from "@/components/ui/input";
import { FieldWrapper } from "./FieldWrapper";
export function PercentField({ fieldDef, value, onChange, readOnly, error, className, }) {
    return (_jsx(FieldWrapper, { fieldDef: fieldDef, error: error, className: className, children: _jsxs("div", { className: "relative", children: [_jsx(Input, { id: fieldDef.name, type: "number", className: "pr-7", value: value ?? "", onChange: (e) => {
                        const v = e.target.value;
                        onChange(v === "" ? 0 : parseFloat(v));
                    }, readOnly: readOnly, disabled: readOnly, min: fieldDef.min_value ?? 0, max: fieldDef.max_value ?? 100, step: "any", placeholder: "0", "aria-invalid": !!error }), _jsx("span", { className: "pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-sm text-muted-foreground", children: "%" })] }) }));
}
export default PercentField;
