import { cn } from "@/lib/utils";
import type { LayoutFieldProps } from "@/components/fields/types";

export function HeadingField({ fieldDef, className }: LayoutFieldProps) {
  return (
    <h3 className={cn("col-span-full text-base font-semibold", className)}>
      {fieldDef.label ?? ""}
    </h3>
  );
}

export default HeadingField;
