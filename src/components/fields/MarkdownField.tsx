import { useState, lazy, Suspense } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FieldWrapper } from "./FieldWrapper";
import type { FieldProps } from "./types";

const ReactMarkdown = lazy(() => import("react-markdown"));

export function MarkdownField({
  fieldDef,
  value,
  onChange,
  readOnly,
  error,
  className,
}: FieldProps<string>) {
  const [preview, setPreview] = useState(readOnly ?? false);
  const text = (value as string) ?? "";

  return (
    <FieldWrapper fieldDef={fieldDef} error={error} className={className}>
      {!readOnly && (
        <div className="flex gap-1 mb-1">
          <Button
            type="button"
            variant={preview ? "ghost" : "secondary"}
            size="xs"
            onClick={() => setPreview(false)}
          >
            Write
          </Button>
          <Button
            type="button"
            variant={preview ? "secondary" : "ghost"}
            size="xs"
            onClick={() => setPreview(true)}
          >
            Preview
          </Button>
        </div>
      )}
      {preview ? (
        <div className="min-h-16 rounded-lg border p-3 prose prose-sm dark:prose-invert">
          <Suspense fallback={<div className="text-sm text-muted-foreground">Loading...</div>}>
            <ReactMarkdown>{text}</ReactMarkdown>
          </Suspense>
        </div>
      ) : (
        <Textarea
          id={fieldDef.name}
          value={text}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly}
          disabled={readOnly}
          rows={6}
          placeholder="Write markdown..."
          className={cn("font-mono text-sm")}
          aria-invalid={!!error}
        />
      )}
    </FieldWrapper>
  );
}

export default MarkdownField;
