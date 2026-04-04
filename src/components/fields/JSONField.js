import { jsx as _jsx } from "react/jsx-runtime";
import { lazy, Suspense, useState, useEffect } from "react";
import { FieldWrapper } from "./FieldWrapper";
const CodeMirror = lazy(() => import("@uiw/react-codemirror"));
function useJsonExtension() {
    const [ext, setExt] = useState([]);
    useEffect(() => {
        void import("@codemirror/lang-json").then((m) => setExt([m.json()]));
    }, []);
    return ext;
}
export function JSONField({ fieldDef, value, onChange, readOnly, error, className, }) {
    const text = typeof value === "string" ? value : JSON.stringify(value ?? {}, null, 2);
    const extensions = useJsonExtension();
    return (_jsx(FieldWrapper, { fieldDef: fieldDef, error: error, className: className, children: _jsx(Suspense, { fallback: _jsx("div", { className: "h-40 animate-pulse rounded-lg bg-muted" }), children: _jsx("div", { className: "overflow-hidden rounded-lg border", children: _jsx(CodeMirror, { value: text, onChange: (v) => onChange(v), readOnly: readOnly, editable: !readOnly, height: "200px", extensions: extensions, basicSetup: {
                        lineNumbers: true,
                        foldGutter: true,
                        highlightActiveLine: !readOnly,
                    } }) }) }) }));
}
export default JSONField;
