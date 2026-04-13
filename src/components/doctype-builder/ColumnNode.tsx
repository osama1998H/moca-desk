import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";

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
}

// ── ColumnNode ───────────────────────────────────────────────────────────────

export function ColumnNode({
  column,
  tabIdx,
  sectionIdx,
  colIdx,
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
          "min-h-[60px] rounded border border-dashed p-1.5 space-y-1",
          isOver && "border-primary bg-primary/5",
        )}
      >
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
