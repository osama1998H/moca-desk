import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Input } from "@/components/ui/input";
import { FieldWrapper } from "./FieldWrapper";
export function CurrencyField({ fieldDef, value, onChange, readOnly, error, className, }) {
    return (_jsx(FieldWrapper, { fieldDef: fieldDef, error: error, className: className, children: _jsxs("div", { className: "relative", children: [_jsx("span", { className: "pointer-events-none absolute inset-y-0 left-2.5 flex items-center text-sm text-muted-foreground", children: fieldDef.options || "$" }), _jsx(Input, { id: fieldDef.name, type: "number", className: "pl-7", value: value ?? "", onChange: (e) => {
                        const v = e.target.value;
                        onChange(v === "" ? 0 : parseFloat(v));
                    }, readOnly: readOnly, disabled: readOnly, min: fieldDef.min_value, max: fieldDef.max_value, step: "0.01", placeholder: "0.00", "aria-invalid": !!error })] }) }));
}
export default CurrencyField;
