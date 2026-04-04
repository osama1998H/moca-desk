import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from "react";
import { ImageIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FieldWrapper } from "./FieldWrapper";
export function AttachImageField({ fieldDef, value, onChange, readOnly, error, className, }) {
    const fileRef = useRef(null);
    const imageUrl = value || "";
    return (_jsxs(FieldWrapper, { fieldDef: fieldDef, error: error, className: className, children: [_jsx("input", { ref: fileRef, type: "file", accept: "image/*", className: "hidden", onChange: (e) => {
                    const file = e.target.files?.[0];
                    if (file)
                        onChange(file.name);
                } }), imageUrl ? (_jsxs("div", { className: "relative inline-block", children: [_jsx("img", { src: imageUrl, alt: fieldDef.label ?? "Image", className: "max-h-40 rounded-lg border object-contain" }), !readOnly && (_jsx(Button, { variant: "secondary", size: "icon-xs", className: "absolute right-1 top-1", onClick: () => onChange(""), children: _jsx(XIcon, {}) }))] })) : (_jsx("button", { type: "button", disabled: readOnly, onClick: () => fileRef.current?.click(), className: cn("flex h-24 w-full items-center justify-center rounded-lg border border-dashed transition-colors", readOnly
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer hover:bg-muted/50"), children: _jsxs("div", { className: "flex flex-col items-center gap-1 text-muted-foreground", children: [_jsx(ImageIcon, { className: "size-6" }), _jsx("span", { className: "text-xs", children: "Upload image" })] }) }))] }));
}
export default AttachImageField;
