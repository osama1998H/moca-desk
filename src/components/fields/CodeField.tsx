import { lazy, Suspense } from "react";
import { FieldWrapper } from "./FieldWrapper";
import type { FieldProps } from "./types";

const CodeMirror = lazy(() => import("@uiw/react-codemirror"));

export function CodeField({
  fieldDef,
  value,
  onChange,
  readOnly,
  error,
  className,
}: FieldProps<string>) {
  const text = (value as string) ?? "";

  return (
    <FieldWrapper fieldDef={fieldDef} error={error} className={className}>
      <Suspense
        fallback={
          <div className="h-40 animate-pulse rounded-lg bg-muted" />
        }
      >
        <div className="overflow-hidden rounded-lg border">
          <CodeMirror
            value={text}
            onChange={(v) => onChange(v)}
            readOnly={readOnly}
            editable={!readOnly}
            height="200px"
            basicSetup={{
              lineNumbers: true,
              foldGutter: true,
              highlightActiveLine: !readOnly,
            }}
          />
        </div>
      </Suspense>
    </FieldWrapper>
  );
}

export default CodeField;
