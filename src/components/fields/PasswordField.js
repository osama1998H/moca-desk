import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FieldWrapper } from "./FieldWrapper";
export function PasswordField({ fieldDef, value, onChange, readOnly, error, className, }) {
    const [visible, setVisible] = useState(false);
    return (_jsx(FieldWrapper, { fieldDef: fieldDef, error: error, className: className, children: _jsxs("div", { className: "relative", children: [_jsx(Input, { id: fieldDef.name, type: visible ? "text" : "password", value: value ?? "", onChange: (e) => onChange(e.target.value), readOnly: readOnly, disabled: readOnly, maxLength: fieldDef.max_length, placeholder: fieldDef.label, className: "pr-9", "aria-invalid": !!error }), _jsx(Button, { type: "button", variant: "ghost", size: "icon-xs", className: "absolute inset-y-0 right-1 my-auto", onClick: () => setVisible((v) => !v), tabIndex: -1, children: visible ? _jsx(EyeOffIcon, {}) : _jsx(EyeIcon, {}) })] }) }));
}
export default PasswordField;
