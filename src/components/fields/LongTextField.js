import { jsx as _jsx } from "react/jsx-runtime";
import { Textarea } from "@/components/ui/textarea";
import { FieldWrapper } from "./FieldWrapper";
export function LongTextField({ fieldDef, value, onChange, readOnly, error, className, }) {
    return (_jsx(FieldWrapper, { fieldDef: fieldDef, error: error, className: className, children: _jsx(Textarea, { id: fieldDef.name, value: value ?? "", onChange: (e) => onChange(e.target.value), readOnly: readOnly, disabled: readOnly, maxLength: fieldDef.max_length, rows: 6, placeholder: fieldDef.label, "aria-invalid": !!error }) }));
}
export default LongTextField;
