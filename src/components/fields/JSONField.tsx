import { lazy, Suspense, useState, useEffect } from "react";
import type { Extension } from "@codemirror/state";
import { FieldWrapper } from "./FieldWrapper";
import type { FieldProps } from "./types";

const CodeMirror = lazy(() => import("@uiw/react-codemirror"));

function useJsonExtension(): Extension[] {
  const [ext, setExt] = useState<Extension[]>([]);
  useEffect(() => {
    void import("@codemirror/lang-json").then((m) => setExt([m.json()]));
  }, []);
  return ext;
}

export function JSONField({
  fieldDef,
  value,
  onChange,
  readOnly,
  error,
  className,
}: FieldProps<string | Record<string, unknown>>) {
  const text =
    typeof value === "string" ? value : JSON.stringify(value ?? {}, null, 2);
  const extensions = useJsonExtension();

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
            extensions={extensions}
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

export default JSONField;
