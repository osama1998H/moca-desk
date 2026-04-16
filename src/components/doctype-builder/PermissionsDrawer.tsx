import { Plus, Trash2 } from "lucide-react";

import { DrawerPanel } from "@/components/builder-kit";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

import { useDocTypeBuilderStore } from "@/stores/doctype-builder-store";
import { DEFAULT_PERMISSION } from "@/components/doctype-builder/types";
import type { PermissionRule } from "@/components/doctype-builder/types";

// ── Permission flags ────────────────────────────────────────────────────────

const PERM_FLAGS = [
  { key: "read", label: "R" },
  { key: "write", label: "W" },
  { key: "create", label: "C" },
  { key: "delete", label: "D" },
  { key: "submit", label: "S" },
  { key: "cancel", label: "X" },
] as const;

type PermFlag = (typeof PERM_FLAGS)[number]["key"];

// ── PermissionsDrawer ───────────────────────────────────────────────────────

export function PermissionsDrawer() {
  const permissions = useDocTypeBuilderStore((s) => s.permissions);
  const setPermissions = useDocTypeBuilderStore((s) => s.setPermissions);

  function updateRow(index: number, patch: Partial<PermissionRule>) {
    const next = permissions.map((p, i) => (i === index ? { ...p, ...patch } : p));
    setPermissions(next);
  }

  function removeRow(index: number) {
    setPermissions(permissions.filter((_, i) => i !== index));
  }

  function addRow() {
    setPermissions([...permissions, { ...DEFAULT_PERMISSION, role: "" }]);
  }

  return (
    <DrawerPanel title="Permissions">
      <div className="flex flex-col gap-2 px-2 py-2">
        {/* Header row */}
        <div className="flex items-center gap-1 px-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          <span className="flex-1">Role</span>
          {PERM_FLAGS.map((flag) => (
            <span key={flag.key} className="w-6 text-center" title={flag.key}>
              {flag.label}
            </span>
          ))}
          <span className="w-6" />
        </div>

        {/* Permission rows */}
        {permissions.map((perm, idx) => (
          <div
            key={idx}
            className="flex items-center gap-1 rounded-md border bg-card px-1 py-1.5"
          >
            <Input
              value={perm.role}
              onChange={(e) => updateRow(idx, { role: e.target.value })}
              placeholder="Role name"
              className="h-6 flex-1 text-xs"
            />

            {PERM_FLAGS.map((flag) => (
              <div key={flag.key} className="flex w-6 items-center justify-center">
                <Checkbox
                  checked={perm[flag.key as PermFlag]}
                  onCheckedChange={(checked) =>
                    updateRow(idx, { [flag.key]: !!checked })
                  }
                />
              </div>
            ))}

            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive"
              onClick={() => removeRow(idx)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}

        {/* Add role button */}
        <Button
          variant="outline"
          size="sm"
          onClick={addRow}
          className="mt-1 w-full"
        >
          <Plus className="me-1 h-3 w-3" />
          Add Role
        </Button>
      </div>
    </DrawerPanel>
  );
}
