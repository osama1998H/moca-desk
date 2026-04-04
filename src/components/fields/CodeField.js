import { jsx as _jsx } from "react/jsx-runtime";
import { lazy, Suspense } from "react";
import { FieldWrapper } from "./FieldWrapper";
const CodeMirror = lazy(() => import("@uiw/react-codemirror"));
export function CodeField({ fieldDef, value, onChange, readOnly, error, className, }) {
    const text = value ?? "";
    return (_jsx(FieldWrapper, { fieldDef: fieldDef, error: error, className: className, children: _jsx(Suspense, { fallback: _jsx("div", { className: "h-40 animate-pulse rounded-lg bg-muted" }), children: _jsx("div", { className: "overflow-hidden rounded-lg border", children: _jsx(CodeMirror, { value: text, onChange: (v) => onChange(v), readOnly: readOnly, editable: !readOnly, height: "200px", basicSetup: {
                        lineNumbers: true,
                        foldGutter: true,
                        highlightActiveLine: !readOnly,
                    } }) }) }) }));
}
export default CodeField;
