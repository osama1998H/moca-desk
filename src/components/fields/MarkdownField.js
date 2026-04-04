import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, lazy, Suspense } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FieldWrapper } from "./FieldWrapper";
const ReactMarkdown = lazy(() => import("react-markdown"));
export function MarkdownField({ fieldDef, value, onChange, readOnly, error, className, }) {
    const [preview, setPreview] = useState(readOnly ?? false);
    const text = value ?? "";
    return (_jsxs(FieldWrapper, { fieldDef: fieldDef, error: error, className: className, children: [!readOnly && (_jsxs("div", { className: "flex gap-1 mb-1", children: [_jsx(Button, { type: "button", variant: preview ? "ghost" : "secondary", size: "xs", onClick: () => setPreview(false), children: "Write" }), _jsx(Button, { type: "button", variant: preview ? "secondary" : "ghost", size: "xs", onClick: () => setPreview(true), children: "Preview" })] })), preview ? (_jsx("div", { className: "min-h-16 rounded-lg border p-3 prose prose-sm dark:prose-invert", children: _jsx(Suspense, { fallback: _jsx("div", { className: "text-sm text-muted-foreground", children: "Loading..." }), children: _jsx(ReactMarkdown, { children: text }) }) })) : (_jsx(Textarea, { id: fieldDef.name, value: text, onChange: (e) => onChange(e.target.value), readOnly: readOnly, disabled: readOnly, rows: 6, placeholder: "Write markdown...", className: cn("font-mono text-sm"), "aria-invalid": !!error }))] }));
}
export default MarkdownField;
