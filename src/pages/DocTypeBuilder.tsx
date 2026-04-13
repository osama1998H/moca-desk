import { useEffect } from "react";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { useParams } from "react-router";
import { toast } from "sonner";
import { Plus, Settings, Shield } from "lucide-react";

import { useMetaType } from "@/providers/MetaProvider";
import {
  BuilderShell,
  BuilderToolbar,
  DrawerPanel,
  type IconRailItem,
} from "@/components/builder-kit";
import { useDocTypeBuilderStore } from "@/stores/doctype-builder-store";
import { SchematicCanvas } from "@/components/doctype-builder/SchematicCanvas";
import { FieldPalette } from "@/components/doctype-builder/FieldPalette";
import { SettingsDrawer } from "@/components/doctype-builder/SettingsDrawer";
import { PermissionsDrawer } from "@/components/doctype-builder/PermissionsDrawer";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { FieldType } from "@/api/types";

// ── Icon rail items ─────────────────────────────────────────────────────────

const ICON_RAIL_ITEMS: IconRailItem[] = [
  { id: "fields", icon: <Plus className="h-4 w-4" />, label: "Fields" },
  { id: "settings", icon: <Settings className="h-4 w-4" />, label: "Settings" },
  {
    id: "permissions",
    icon: <Shield className="h-4 w-4" />,
    label: "Permissions",
  },
];

// ── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Walk the layout tree to find which column contains a given field name.
 * Returns the tab/section/column indices and the field index within that column.
 */
function findFieldLocation(
  layout: { tabs: { sections: { columns: { fields: string[] }[] }[] }[] },
  fieldName: string,
): { tabIdx: number; sectionIdx: number; colIdx: number; fieldIdx: number } | null {
  for (let t = 0; t < layout.tabs.length; t++) {
    const tab = layout.tabs[t]!;
    for (let s = 0; s < tab.sections.length; s++) {
      const section = tab.sections[s]!;
      for (let c = 0; c < section.columns.length; c++) {
        const col = section.columns[c]!;
        const fIdx = col.fields.indexOf(fieldName);
        if (fIdx !== -1) {
          return { tabIdx: t, sectionIdx: s, colIdx: c, fieldIdx: fIdx };
        }
      }
    }
  }
  return null;
}

// ── DocTypeBuilder ──────────────────────────────────────────────────────────

export default function DocTypeBuilder() {
  const { name: urlName } = useParams<{ name?: string }>();
  const store = useDocTypeBuilderStore();

  // Fetch existing doctype metadata if editing
  const { data: meta, isLoading, error } = useMetaType(urlName ?? "");

  // Hydrate store when metadata is loaded
  useEffect(() => {
    if (meta) {
      const fieldsMap: Record<string, (typeof meta.fields)[number]> = {};
      for (const f of meta.fields) {
        fieldsMap[f.name] = f;
      }

      store.hydrate({
        name: meta.name,
        module: meta.module ?? "",
        layout: meta.layout ?? { tabs: [{ label: "Details", sections: [{ columns: [{ fields: meta.fields.map((f) => f.name) }] }] }] },
        fields: meta.fields_map ?? fieldsMap,
        settings: {
          naming_rule: meta.naming_rule,
          title_field: meta.title_field ?? "",
          sort_field: meta.sort_field ?? "",
          sort_order: (meta.sort_order as "asc" | "desc") ?? "desc",
          search_fields: meta.search_fields ?? [],
          image_field: meta.image_field ?? "",
          is_submittable: meta.is_submittable,
          is_single: meta.is_single,
          is_child_table: meta.is_child_table,
          is_virtual: false,
          track_changes: meta.track_changes ?? true,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta]);

  // Reset store when navigating to a new doctype builder (no URL param)
  useEffect(() => {
    if (!urlName) {
      store.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlName]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error(`Failed to load DocType: ${error.message}`);
    }
  }, [error]);

  // ── DnD handler ─────────────────────────────────────────────────────────

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    // Case 1: Palette field dropped on a column
    if (activeData?.type === "palette-field" && overData?.type === "column") {
      const fieldType = activeData.fieldType as FieldType;
      store.addField(
        fieldType,
        overData.tabIdx as number,
        overData.sectionIdx as number,
        overData.colIdx as number,
      );
      return;
    }

    // Case 2: Canvas field dropped on a column (cross-column move)
    if (activeData?.type === "canvas-field" && overData?.type === "column") {
      const fieldName = active.id as string;
      store.moveField(
        fieldName,
        overData.tabIdx as number,
        overData.sectionIdx as number,
        overData.colIdx as number,
        0,
      );
      return;
    }

    // Case 3: Canvas field dropped on another canvas field (reorder within/across columns)
    if (activeData?.type === "canvas-field" && overData?.type === "canvas-field") {
      const draggedFieldName = active.id as string;
      const overFieldName = over.id as string;

      // Find where the target field lives
      const location = findFieldLocation(store.layout, overFieldName);
      if (!location) return;

      // Compute insert index -- place before the target field
      store.moveField(
        draggedFieldName,
        location.tabIdx,
        location.sectionIdx,
        location.colIdx,
        location.fieldIdx,
      );
    }
  }

  // ── Save handler (placeholder) ────────────────────────────────────────

  function handleSave() {
    toast.info("Save not implemented yet");
  }

  // ── Drawer content ────────────────────────────────────────────────────

  function renderDrawer() {
    switch (store.activeDrawer) {
      case "fields":
        return <DrawerPanel title="Fields"><FieldPalette /></DrawerPanel>;
      case "settings":
        return <SettingsDrawer />;
      case "permissions":
        return <PermissionsDrawer />;
      default:
        return null;
    }
  }

  // ── Loading state ─────────────────────────────────────────────────────

  if (urlName && isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading DocType...</div>
      </div>
    );
  }

  // ── Field count for status bar ────────────────────────────────────────

  const fieldCount = Object.keys(store.fields).length;

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <BuilderShell
        toolbar={
          <BuilderToolbar
            name={store.name}
            onNameChange={store.setName}
            mode={store.mode}
            onModeChange={store.setMode}
            onSave={handleSave}
            isDirty={store.isDirty}
          >
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Label htmlFor="builder-app" className="text-xs text-muted-foreground">
                  App
                </Label>
                <Input
                  id="builder-app"
                  value={store.app ?? ""}
                  onChange={(e) => store.setApp(e.target.value || null)}
                  placeholder="App"
                  className="h-7 w-24 text-xs"
                />
              </div>
              <div className="flex items-center gap-1">
                <Label htmlFor="builder-module" className="text-xs text-muted-foreground">
                  Module
                </Label>
                <Input
                  id="builder-module"
                  value={store.module}
                  onChange={(e) => store.setModule(e.target.value)}
                  placeholder="Module"
                  className="h-7 w-24 text-xs"
                />
              </div>
            </div>
          </BuilderToolbar>
        }
        iconRailItems={ICON_RAIL_ITEMS}
        activeDrawer={store.activeDrawer}
        onDrawerToggle={(id) => store.toggleDrawer(id as "fields" | "settings" | "permissions")}
        leftDrawer={renderDrawer()}
        statusBar={
          <>
            <span>{fieldCount} field{fieldCount !== 1 ? "s" : ""}</span>
            {store.isDirty && (
              <span className="ml-2 text-amber-500">Modified</span>
            )}
          </>
        }
      >
        <SchematicCanvas />
      </BuilderShell>
    </DndContext>
  );
}
