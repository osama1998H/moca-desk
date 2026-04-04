import { jsx as _jsx } from "react/jsx-runtime";
import { Input } from "@/components/ui/input";
import { FieldWrapper } from "./FieldWrapper";
export function TimeField({ fieldDef, value, onChange, readOnly, error, className, }) {
    return (_jsx(FieldWrapper, { fieldDef: fieldDef, error: error, className: className, children: _jsx(Input, { id: fieldDef.name, type: "time", value: value ?? "", onChange: (e) => onChange(e.target.value), readOnly: readOnly, disabled: readOnly, placeholder: "HH:MM", "aria-invalid": !!error }) }));
}
export default TimeField;
