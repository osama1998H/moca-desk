import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { LayoutFieldProps } from "@/components/fields/types";

export function SectionBreak({
  fieldDef,
  children,
  className,
}: LayoutFieldProps) {
  const collapsible = fieldDef.collapsible ?? false;
  const [collapsed, setCollapsed] = useState(
    fieldDef.collapsed_by_default ?? false,
  );

  const label = fieldDef.layout_label || fieldDef.label;

  return (
    <div className={cn("col-span-full", className)}>
      <Separator className="mb-3" />
      {label && (
        <button
          type="button"
          className={cn(
            "flex w-full items-center gap-1.5 text-sm font-medium text-muted-foreground",
            collapsible && "cursor-pointer hover:text-foreground",
            !collapsible && "cursor-default",
          )}
          onClick={collapsible ? () => setCollapsed((c) => !c) : undefined}
          disabled={!collapsible}
        >
          {collapsible && (
            <ChevronDownIcon
              className={cn(
                "size-4 transition-transform",
                collapsed && "-rotate-90",
              )}
            />
          )}
          {label}
        </button>
      )}
      {(!collapsible || !collapsed) && children && (
        <div className="mt-3">{children}</div>
      )}
    </div>
  );
}

export default SectionBreak;
