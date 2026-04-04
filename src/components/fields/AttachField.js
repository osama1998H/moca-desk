import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from "react";
import { PaperclipIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldWrapper } from "./FieldWrapper";
export function AttachField({ fieldDef, value, onChange, readOnly, error, className, }) {
    const fileRef = useRef(null);
    const fileName = value ? String(value).split("/").pop() : "";
    if (readOnly) {
        return (_jsx(FieldWrapper, { fieldDef: fieldDef, error: error, className: className, children: _jsx("div", { className: "flex h-8 items-center gap-1.5 rounded-lg border border-input px-2.5 text-sm", children: value ? (_jsx("a", { href: String(value), target: "_blank", rel: "noopener noreferrer", className: "truncate text-primary hover:underline", children: fileName })) : (_jsx("span", { className: "text-muted-foreground", children: "No file" })) }) }));
    }
    return (_jsxs(FieldWrapper, { fieldDef: fieldDef, error: error, className: className, children: [_jsx("input", { ref: fileRef, type: "file", className: "hidden", onChange: (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                        // Store the file name for now; actual upload is handled by form submission
                        onChange(file.name);
                    }
                } }), value ? (_jsxs("div", { className: "flex h-8 items-center gap-1.5 rounded-lg border border-input px-2.5 text-sm", children: [_jsx(PaperclipIcon, { className: "size-3.5 shrink-0 text-muted-foreground" }), _jsx("span", { className: "truncate", children: fileName }), _jsx(Button, { variant: "ghost", size: "icon-xs", className: "ml-auto shrink-0", onClick: () => onChange(""), children: _jsx(XIcon, {}) })] })) : (_jsxs(Button, { id: fieldDef.name, variant: "outline", className: "w-full justify-start font-normal text-muted-foreground", "aria-invalid": !!error, onClick: () => fileRef.current?.click(), children: [_jsx(PaperclipIcon, { "data-icon": "inline-start" }), "Choose file"] }))] }));
}
export default AttachField;
