import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { FieldWrapper } from "./FieldWrapper";
function parseOptions(options) {
    if (!options)
        return [];
    return options
        .split("\n")
        .map((o) => o.trim())
        .filter(Boolean);
}
export function SelectField({ fieldDef, value, onChange, readOnly, error, className, }) {
    const options = parseOptions(fieldDef.options);
    return (_jsx(FieldWrapper, { fieldDef: fieldDef, error: error, className: className, children: _jsxs(Select, { value: value ?? "", onValueChange: onChange, disabled: readOnly, children: [_jsx(SelectTrigger, { id: fieldDef.name, className: "w-full", "aria-invalid": !!error, children: _jsx(SelectValue, { placeholder: `Select ${fieldDef.label ?? ""}...` }) }), _jsx(SelectContent, { children: _jsx(SelectGroup, { children: options.map((opt) => (_jsx(SelectItem, { value: opt, children: opt }, opt))) }) })] }) }));
}
export default SelectField;
