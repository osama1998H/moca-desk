import { cn } from "@/lib/utils";
import type { LayoutFieldProps } from "@/components/fields/types";

export function HTMLDisplay({ fieldDef, className }: LayoutFieldProps) {
  const content = fieldDef.options ?? "";

  return (
    <div
      className={cn("prose prose-sm dark:prose-invert", className)}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

export default HTMLDisplay;
