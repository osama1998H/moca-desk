import { jsx as _jsx } from "react/jsx-runtime";
import { Input } from "@/components/ui/input";
import { FieldWrapper } from "./FieldWrapper";
export function DataField({ fieldDef, value, onChange, readOnly, error, className, }) {
    return (_jsx(FieldWrapper, { fieldDef: fieldDef, error: error, className: className, children: _jsx(Input, { id: fieldDef.name, value: value ?? "", onChange: (e) => onChange(e.target.value), readOnly: readOnly, disabled: readOnly, maxLength: fieldDef.max_length, placeholder: fieldDef.label, "aria-invalid": !!error }) }));
}
export default DataField;
