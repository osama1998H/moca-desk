import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { ChevronDown, GripVertical } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

import type { FieldType } from "@/api/types";
import {
  FIELD_TYPE_CATEGORIES,
  type FieldTypeCategory,
} from "./field-type-categories";

// ── Draggable palette item ────────────────────────────────────────────────────

interface PaletteItemProps {
  fieldType: FieldType;
  label: string;
}

function PaletteItem({ fieldType, label }: PaletteItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${fieldType}`,
    data: { type: "palette-field", fieldType },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        "flex cursor-grab items-center gap-1 rounded-md border border-border bg-card px-2 py-1.5 text-xs select-none",
        "hover:border-primary/50 hover:bg-primary/5 transition-colors",
        isDragging && "opacity-50 cursor-grabbing shadow-lg",
      )}
    >
      <GripVertical className="h-3 w-3 shrink-0 text-muted-foreground" />
      <span className="truncate">{label}</span>
    </div>
  );
}

// ── Category section ──────────────────────────────────────────────────────────

interface CategorySectionProps {
  category: FieldTypeCategory;
}

function CategorySection({ category }: CategorySectionProps) {
  const [open, setOpen] = useState(true);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-sm px-1 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
        {category.label}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="mt-1 mb-2 grid grid-cols-2 gap-1">
          {category.types.map(({ type, label }) => (
            <PaletteItem key={type} fieldType={type} label={label} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

// ── FieldPalette ──────────────────────────────────────────────────────────────

export function FieldPalette() {
  return (
    <div className="flex flex-col gap-1 px-2 py-2">
      {FIELD_TYPE_CATEGORIES.map((category) => (
        <CategorySection key={category.label} category={category} />
      ))}
    </div>
  );
}
