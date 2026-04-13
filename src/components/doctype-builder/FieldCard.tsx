import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type { FieldDef } from "@/api/types";

// ── Props ─────────────────────────────────────────────────────────────────────

interface FieldCardProps {
  fieldDef: FieldDef;
  isSelected: boolean;
  onClick: () => void;
}

// ── FieldCard ─────────────────────────────────────────────────────────────────

export function FieldCard({ fieldDef, isSelected, onClick }: FieldCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: fieldDef.name,
    data: { type: "canvas-field", fieldName: fieldDef.name },
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const hasLinkTarget =
    (fieldDef.field_type === "Link" || fieldDef.field_type === "Table") &&
    fieldDef.options;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      onClick={onClick}
      className={cn(
        "group flex items-center gap-2 rounded-md border bg-card px-3 py-2 cursor-pointer select-none",
        "hover:border-primary/50 transition-colors",
        isSelected &&
          "border-primary ring-1 ring-primary bg-primary/5",
        isDragging && "opacity-50 shadow-lg",
      )}
    >
      {/* Drag handle */}
      <button
        ref={setActivatorNodeRef}
        {...listeners}
        type="button"
        onClick={(e) => e.stopPropagation()}
        className="cursor-grab touch-none text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 shrink-0"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Field info */}
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="truncate text-sm font-medium">
          {fieldDef.label || fieldDef.name}
        </span>

        {fieldDef.required && (
          <span className="shrink-0 text-destructive text-sm font-bold leading-none">
            *
          </span>
        )}

        {hasLinkTarget && (
          <span className="truncate text-xs text-muted-foreground">
            {fieldDef.options}
          </span>
        )}
      </div>

      {/* Field type badge */}
      <Badge
        variant="secondary"
        className="shrink-0 font-mono text-[10px]"
      >
        {fieldDef.field_type}
      </Badge>
    </div>
  );
}
