import { DrawerPanel } from "@/components/builder-kit";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import { useDocTypeBuilderStore } from "@/stores/doctype-builder-store";

// ── Naming rule options ─────────────────────────────────────────────────────

const NAMING_RULES = [
  { value: "uuid", label: "UUID" },
  { value: "autoincrement", label: "Auto Increment" },
  { value: "pattern", label: "Pattern" },
  { value: "field", label: "Field" },
  { value: "hash", label: "Hash" },
] as const;

const SORT_ORDERS = [
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" },
] as const;

// ── SettingsDrawer ──────────────────────────────────────────────────────────

export function SettingsDrawer() {
  const settings = useDocTypeBuilderStore((s) => s.settings);
  const updateSettings = useDocTypeBuilderStore((s) => s.updateSettings);

  return (
    <DrawerPanel title="Settings">
      <div className="flex flex-col gap-4 px-3 py-3">
        {/* Naming Rule */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="naming-rule">Naming Rule</Label>
          <Select
            value={settings.naming_rule.rule}
            onValueChange={(value) =>
              updateSettings({
                naming_rule: { ...settings.naming_rule, rule: value },
              })
            }
          >
            <SelectTrigger id="naming-rule" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {NAMING_RULES.map((rule) => (
                <SelectItem key={rule.value} value={rule.value}>
                  {rule.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Pattern (only shown when naming_rule.rule === "pattern") */}
        {settings.naming_rule.rule === "pattern" && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="naming-pattern">Pattern</Label>
            <Input
              id="naming-pattern"
              value={settings.naming_rule.pattern ?? ""}
              onChange={(e) =>
                updateSettings({
                  naming_rule: {
                    ...settings.naming_rule,
                    pattern: e.target.value,
                  },
                })
              }
              placeholder="e.g. INV-.####"
              className="h-7 text-xs"
            />
          </div>
        )}

        {/* Title Field */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title-field">Title Field</Label>
          <Input
            id="title-field"
            value={settings.title_field}
            onChange={(e) => updateSettings({ title_field: e.target.value })}
            placeholder="e.g. title"
            className="h-7 text-xs"
          />
        </div>

        {/* Sort Field */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sort-field">Sort Field</Label>
          <Input
            id="sort-field"
            value={settings.sort_field}
            onChange={(e) => updateSettings({ sort_field: e.target.value })}
            placeholder="e.g. modified"
            className="h-7 text-xs"
          />
        </div>

        {/* Sort Order */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sort-order">Sort Order</Label>
          <Select
            value={settings.sort_order}
            onValueChange={(value) =>
              updateSettings({ sort_order: value as "asc" | "desc" })
            }
          >
            <SelectTrigger id="sort-order" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_ORDERS.map((order) => (
                <SelectItem key={order.value} value={order.value}>
                  {order.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Boolean switches */}
        <div className="flex flex-col gap-3 pt-1">
          <div className="flex items-center justify-between">
            <Label htmlFor="is-submittable">Is Submittable</Label>
            <Switch
              id="is-submittable"
              size="sm"
              checked={settings.is_submittable}
              onCheckedChange={(checked) =>
                updateSettings({ is_submittable: !!checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="track-changes">Track Changes</Label>
            <Switch
              id="track-changes"
              size="sm"
              checked={settings.track_changes}
              onCheckedChange={(checked) =>
                updateSettings({ track_changes: !!checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="is-single">Is Single</Label>
            <Switch
              id="is-single"
              size="sm"
              checked={settings.is_single}
              onCheckedChange={(checked) =>
                updateSettings({ is_single: !!checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="is-child-table">Is Child Table</Label>
            <Switch
              id="is-child-table"
              size="sm"
              checked={settings.is_child_table}
              onCheckedChange={(checked) =>
                updateSettings({ is_child_table: !!checked })
              }
            />
          </div>
        </div>
      </div>
    </DrawerPanel>
  );
}
