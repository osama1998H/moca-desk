import { useRef } from "react";
import { PaperclipIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldWrapper } from "./FieldWrapper";
import type { FieldProps } from "./types";

export function AttachField({
  fieldDef,
  value,
  onChange,
  readOnly,
  error,
  className,
}: FieldProps<string>) {
  const fileRef = useRef<HTMLInputElement>(null);
  const fileName = value ? String(value).split("/").pop() : "";

  if (readOnly) {
    return (
      <FieldWrapper fieldDef={fieldDef} error={error} className={className}>
        <div className="flex h-8 items-center gap-1.5 rounded-lg border border-input px-2.5 text-sm">
          {value ? (
            <a
              href={String(value)}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-primary hover:underline"
            >
              {fileName}
            </a>
          ) : (
            <span className="text-muted-foreground">No file</span>
          )}
        </div>
      </FieldWrapper>
    );
  }

  return (
    <FieldWrapper fieldDef={fieldDef} error={error} className={className}>
      <input
        ref={fileRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            // Store the file name for now; actual upload is handled by form submission
            onChange(file.name);
          }
        }}
      />
      {value ? (
        <div className="flex h-8 items-center gap-1.5 rounded-lg border border-input px-2.5 text-sm">
          <PaperclipIcon className="size-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate">{fileName}</span>
          <Button
            variant="ghost"
            size="icon-xs"
            className="ms-auto shrink-0"
            onClick={() => onChange("")}
          >
            <XIcon />
          </Button>
        </div>
      ) : (
        <Button
          id={fieldDef.name}
          variant="outline"
          className="w-full justify-start font-normal text-muted-foreground"
          aria-invalid={!!error}
          onClick={() => fileRef.current?.click()}
        >
          <PaperclipIcon data-icon="inline-start" />
          Choose file
        </Button>
      )}
    </FieldWrapper>
  );
}

export default AttachField;
