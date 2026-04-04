import { useRef } from "react";
import { ImageIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FieldWrapper } from "./FieldWrapper";
import type { FieldProps } from "./types";

export function AttachImageField({
  fieldDef,
  value,
  onChange,
  readOnly,
  error,
  className,
}: FieldProps<string>) {
  const fileRef = useRef<HTMLInputElement>(null);
  const imageUrl = (value as string) || "";

  return (
    <FieldWrapper fieldDef={fieldDef} error={error} className={className}>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onChange(file.name);
        }}
      />
      {imageUrl ? (
        <div className="relative inline-block">
          <img
            src={imageUrl}
            alt={fieldDef.label ?? "Image"}
            className="max-h-40 rounded-lg border object-contain"
          />
          {!readOnly && (
            <Button
              variant="secondary"
              size="icon-xs"
              className="absolute right-1 top-1"
              onClick={() => onChange("")}
            >
              <XIcon />
            </Button>
          )}
        </div>
      ) : (
        <button
          type="button"
          disabled={readOnly}
          onClick={() => fileRef.current?.click()}
          className={cn(
            "flex h-24 w-full items-center justify-center rounded-lg border border-dashed transition-colors",
            readOnly
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer hover:bg-muted/50",
          )}
        >
          <div className="flex flex-col items-center gap-1 text-muted-foreground">
            <ImageIcon className="size-6" />
            <span className="text-xs">Upload image</span>
          </div>
        </button>
      )}
    </FieldWrapper>
  );
}

export default AttachImageField;
