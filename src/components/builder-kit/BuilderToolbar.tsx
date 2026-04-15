import type { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

/**
 * Auto-format input to PascalCase for DocType names.
 * "library member" -> "LibraryMember", "my-thing" -> "MyThing"
 */
function toPascalCase(input: string): string {
  return input
    .replace(/[^a-zA-Z0-9\s\-_]/g, "")
    .split(/[\s\-_]+|(?<=[a-z0-9])(?=[A-Z])/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join("");
}

export interface BuilderToolbarProps {
  name: string;
  onNameChange: (name: string) => void;
  mode: "schematic" | "preview";
  onModeChange: (mode: "schematic" | "preview") => void;
  onSave: () => void;
  isSaving?: boolean;
  isDirty?: boolean;
  children?: ReactNode;
}

export function BuilderToolbar({
  name,
  onNameChange,
  mode,
  onModeChange,
  onSave,
  isSaving = false,
  isDirty = false,
  children,
}: BuilderToolbarProps) {
  return (
    <div className="flex h-12 items-center justify-between border-b px-3">
      <div className="flex items-center gap-2">
        <Input
          value={name}
          onChange={(e) => onNameChange(toPascalCase(e.target.value))}
          className="h-7 w-48 text-sm font-medium"
          placeholder="e.g. LibraryMember"
        />
      </div>

      <div className="flex items-center gap-2">
        <ToggleGroup
          type="single"
          value={mode}
          onValueChange={(value) => {
            if (value) onModeChange(value as "schematic" | "preview");
          }}
          size="sm"
          variant="outline"
        >
          <ToggleGroupItem value="schematic">Schematic</ToggleGroupItem>
          <ToggleGroupItem value="preview">Preview</ToggleGroupItem>
        </ToggleGroup>

        {children}

        <Button size="sm" onClick={onSave} disabled={isSaving || !isDirty}>
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
