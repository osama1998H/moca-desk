import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { ColumnDef } from "@/api/types";
import { useDocTypeBuilderStore } from "@/stores/doctype-builder-store";
import { FieldCard } from "./FieldCard";

// ── Props ─────────────────────────────────────────────────────────────────────

interface ColumnNodeProps {
  column: ColumnDef;
  tabIdx: number;
  sectionIdx: number;
  colIdx: number;
  onRemoveColumn: () => void;
  totalColumns: number;
}

// ── ColumnNode ───────────────────────────────────────────────────────────────

export function ColumnNode({
  column,
  tabIdx,
  sectionIdx,
  colIdx,
  onRemoveColumn,
  totalColumns,
}: ColumnNodeProps) {
  const fields = useDocTypeBuilderStore((s) => s.fields);
  const selection = useDocTypeBuilderStore((s) => s.selection);
  const setSelection = useDocTypeBuilderStore((s) => s.setSelection);
  const toggleDrawer = useDocTypeBuilderStore((s) => s.toggleDrawer);

  const droppableId = `col-${tabIdx}-${sectionIdx}-${colIdx}`;

  const { setNodeRef, isOver } = useDroppable({
    id: droppableId,
    data: { type: "column", tabIdx, sectionIdx, colIdx },
  });

  return (
    <SortableContext
      items={column.fields}
      strategy={verticalListSortingStrategy}
    >
      <div
        ref={setNodeRef}
        className={cn(
          "group/col relative min-h-[60px] rounded border border-dashed p-1.5 space-y-1",
          isOver && "border-primary bg-primary/5",
        )}
      >
        {totalColumns > 1 && (
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onRemoveColumn}
            className="absolute -top-1 -right-1 h-5 w-5 opacity-0 group-hover/col:opacity-100 text-destructive hover:text-destructive z-10"
          >
            <Trash2 className="h-3 w-3" />
            <span className="sr-only">Delete column</span>
          </Button>
        )}
        {column.fields.map((fieldName) => {
          const fieldDef = fields[fieldName];
          if (!fieldDef) return null;

          return (
            <FieldCard
              key={fieldName}
              fieldDef={fieldDef}
              isSelected={
                selection?.type === "field" && selection.id === fieldName
              }
              onClick={() => setSelection({ type: "field", id: fieldName })}
            />
          );
        })}

        {/* Add field button */}
        <div className="flex justify-center pt-0.5">
          <Button
            variant="ghost"
            size="xs"
            onClick={() => toggleDrawer("fields")}
            className="text-muted-foreground"
          >
            <Plus className="h-3 w-3" />
            Add Field
          </Button>
        </div>
      </div>
    </SortableContext>
  );
}
