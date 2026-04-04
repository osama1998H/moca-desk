import { jsx as _jsx } from "react/jsx-runtime";
import { Input } from "@/components/ui/input";
import { FieldWrapper } from "./FieldWrapper";
export function FloatField({ fieldDef, value, onChange, readOnly, error, className, }) {
    return (_jsx(FieldWrapper, { fieldDef: fieldDef, error: error, className: className, children: _jsx(Input, { id: fieldDef.name, type: "number", value: value ?? "", onChange: (e) => {
                const v = e.target.value;
                onChange(v === "" ? 0 : parseFloat(v));
            }, readOnly: readOnly, disabled: readOnly, min: fieldDef.min_value, max: fieldDef.max_value, step: "any", placeholder: fieldDef.label, "aria-invalid": !!error }) }));
}
export default FloatField;
