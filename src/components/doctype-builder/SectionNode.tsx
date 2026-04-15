import { MoreHorizontal, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { SectionDef } from "@/api/types";
import { useDocTypeBuilderStore } from "@/stores/doctype-builder-store";
import { ColumnNode } from "./ColumnNode";

// ── Props ─────────────────────────────────────────────────────────────────────

interface SectionNodeProps {
  section: SectionDef;
  tabIdx: number;
  sectionIdx: number;
  onAddColumn: () => void;
  onRemoveSection: () => void;
  onUpdateLabel: (label: string) => void;
}

// ── SectionNode ──────────────────────────────────────────────────────────────

export function SectionNode({
  section,
  tabIdx,
  sectionIdx,
  onAddColumn,
  onRemoveSection,
  onUpdateLabel,
}: SectionNodeProps) {
  const removeColumn = useDocTypeBuilderStore((s) => s.removeColumn);

  return (
    <div className="rounded-lg border bg-background p-3 mb-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <input
          type="text"
          value={section.label ?? ""}
          placeholder="Section label"
          onChange={(e) => onUpdateLabel(e.target.value)}
          className="bg-transparent text-xs font-medium outline-none placeholder:text-muted-foreground/60 flex-1 min-w-0"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-xs">
              <MoreHorizontal className="h-3.5 w-3.5" />
              <span className="sr-only">Section options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              variant="destructive"
              onClick={onRemoveSection}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete section
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Body — columns side by side */}
      <div className="flex flex-row gap-2">
        {section.columns.map((col, colIdx) => (
          <div key={colIdx} style={{ flex: col.width ?? 1 }}>
            <ColumnNode
              column={col}
              tabIdx={tabIdx}
              sectionIdx={sectionIdx}
              colIdx={colIdx}
              onRemoveColumn={() => removeColumn(tabIdx, sectionIdx, colIdx)}
              totalColumns={section.columns.length}
            />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-center mt-2">
        <Button
          variant="ghost"
          size="xs"
          onClick={onAddColumn}
          className="text-muted-foreground"
        >
          <Plus className="h-3 w-3" />
          Add Column
        </Button>
      </div>
    </div>
  );
}
