import { create } from "zustand";
import type {
  FieldDef,
  FieldType,
  LayoutTree,
  TabDef,
  SectionDef,
  ColumnDef,
} from "@/api/types";
import type {
  DocTypeSettings,
  BuilderSelection,
  ActiveDrawer,
  PermissionRule,
} from "@/components/doctype-builder/types";
import {
  generateFieldName,
  DEFAULT_SETTINGS,
  DEFAULT_PERMISSION,
} from "@/components/doctype-builder/types";

// ── State shape ─────────────────────────────────────────────────────────────

interface DocTypeBuilderState {
  // Identity
  name: string;
  app: string | null;
  module: string;
  isNew: boolean;

  // Data
  layout: LayoutTree;
  fields: Record<string, FieldDef>;
  settings: DocTypeSettings;
  permissions: PermissionRule[];

  // UI
  selection: BuilderSelection | null;
  activeDrawer: ActiveDrawer;
  mode: "schematic" | "preview";
  isDirty: boolean;

  // ── Simple setters ──────────────────────────────────────────────────────
  setName: (name: string) => void;
  setApp: (app: string | null) => void;
  setModule: (module: string) => void;
  setMode: (mode: "schematic" | "preview") => void;
  setSelection: (selection: BuilderSelection | null) => void;
  setActiveDrawer: (drawer: ActiveDrawer) => void;
  toggleDrawer: (drawer: NonNullable<ActiveDrawer>) => void;

  // ── Field operations ────────────────────────────────────────────────────
  addField: (
    fieldType: FieldType,
    tabIdx: number,
    sectionIdx: number,
    columnIdx: number,
    insertIdx?: number,
  ) => string;
  removeField: (fieldName: string) => void;
  updateField: (fieldName: string, patch: Partial<FieldDef>) => void;
  moveField: (
    fieldName: string,
    toTabIdx: number,
    toSectionIdx: number,
    toColumnIdx: number,
    toFieldIdx: number,
  ) => void;

  // ── Layout operations ───────────────────────────────────────────────────
  addTab: (label?: string) => void;
  removeTab: (tabIdx: number) => void;
  updateTab: (tabIdx: number, patch: Partial<TabDef>) => void;
  addSection: (tabIdx: number, label?: string) => void;
  removeSection: (tabIdx: number, sectionIdx: number) => void;
  updateSection: (
    tabIdx: number,
    sectionIdx: number,
    patch: Partial<SectionDef>,
  ) => void;
  addColumn: (tabIdx: number, sectionIdx: number) => void;
  removeColumn: (
    tabIdx: number,
    sectionIdx: number,
    columnIdx: number,
  ) => void;
  updateColumnWidth: (
    tabIdx: number,
    sectionIdx: number,
    columnIdx: number,
    width: number,
  ) => void;

  // ── Settings & permissions ──────────────────────────────────────────────
  updateSettings: (patch: Partial<DocTypeSettings>) => void;
  setPermissions: (permissions: PermissionRule[]) => void;

  // ── Persistence ─────────────────────────────────────────────────────────
  markClean: () => void;
  hydrate: (data: HydratePayload) => void;
  reset: () => void;
}

/** Payload accepted by hydrate() to load an existing doctype into the builder. */
export interface HydratePayload {
  name: string;
  app?: string | null;
  module?: string;
  layout: LayoutTree;
  fields: Record<string, FieldDef>;
  settings: DocTypeSettings;
  permissions?: PermissionRule[];
}

// ── Defaults ────────────────────────────────────────────────────────────────

function defaultLayout(): LayoutTree {
  return {
    tabs: [
      {
        label: "Details",
        sections: [{ columns: [{ fields: [] }] }],
      },
    ],
  };
}

function initialState() {
  return {
    name: "",
    app: null as string | null,
    module: "",
    isNew: true,
    layout: defaultLayout(),
    fields: {} as Record<string, FieldDef>,
    settings: { ...DEFAULT_SETTINGS, search_fields: [] as string[] },
    permissions: [{ ...DEFAULT_PERMISSION }],
    selection: null as BuilderSelection | null,
    activeDrawer: null as ActiveDrawer,
    mode: "schematic" as const,
    isDirty: false,
  };
}

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Remove a field name from every column in every section in every tab. */
function purgeFieldFromLayout(layout: LayoutTree, fieldName: string): void {
  for (const tab of layout.tabs) {
    for (const section of tab.sections) {
      for (const column of section.columns) {
        const idx = column.fields.indexOf(fieldName);
        if (idx !== -1) column.fields.splice(idx, 1);
      }
    }
  }
}

/** Convert a field name to a human-readable label. "long_text" -> "Long Text" */
function nameToLabel(name: string): string {
  return name
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// ── Store ───────────────────────────────────────────────────────────────────

export const useDocTypeBuilderStore = create<DocTypeBuilderState>(
  (set, get) => ({
    ...initialState(),

    // ── Simple setters ────────────────────────────────────────────────────
    setName: (name) => set({ name, isDirty: true }),
    setApp: (app) => set({ app, isDirty: true }),
    setModule: (module) => set({ module, isDirty: true }),
    setMode: (mode) => set({ mode }),
    setSelection: (selection) => set({ selection }),
    setActiveDrawer: (activeDrawer) => set({ activeDrawer }),

    toggleDrawer: (drawer) => {
      const current = get().activeDrawer;
      set({ activeDrawer: current === drawer ? null : drawer });
    },

    // ── Field operations ──────────────────────────────────────────────────

    addField: (fieldType, tabIdx, sectionIdx, columnIdx, insertIdx) => {
      const s = get();
      const existingNames = new Set(Object.keys(s.fields));
      const name = generateFieldName(fieldType, existingNames);

      const field: FieldDef = {
        name,
        field_type: fieldType,
        label: nameToLabel(name),
        required: false,
        read_only: false,
        in_api: true,
      };

      const layout = structuredClone(s.layout);
      const col = layout.tabs[tabIdx]?.sections[sectionIdx]?.columns[columnIdx];
      if (col) {
        const idx =
          insertIdx !== undefined
            ? Math.min(insertIdx, col.fields.length)
            : col.fields.length;
        col.fields.splice(idx, 0, name);
      }

      set({
        fields: { ...s.fields, [name]: field },
        layout,
        isDirty: true,
      });

      return name;
    },

    removeField: (fieldName) => {
      const s = get();
      if (!(fieldName in s.fields)) return;

      const layout = structuredClone(s.layout);
      purgeFieldFromLayout(layout, fieldName);

      const fields = { ...s.fields };
      delete fields[fieldName];

      set({ fields, layout, isDirty: true });
    },

    updateField: (fieldName, patch) => {
      const s = get();
      const existing = s.fields[fieldName];
      if (!existing) return;

      set({
        fields: { ...s.fields, [fieldName]: { ...existing, ...patch } },
        isDirty: true,
      });
    },

    moveField: (fieldName, toTabIdx, toSectionIdx, toColumnIdx, toFieldIdx) => {
      const s = get();
      if (!(fieldName in s.fields)) return;

      const layout = structuredClone(s.layout);

      // Remove from all current positions
      purgeFieldFromLayout(layout, fieldName);

      // Insert at target
      const col =
        layout.tabs[toTabIdx]?.sections[toSectionIdx]?.columns[toColumnIdx];
      if (col) {
        const idx = Math.min(toFieldIdx, col.fields.length);
        col.fields.splice(idx, 0, fieldName);
      }

      set({ layout, isDirty: true });
    },

    // ── Layout operations ─────────────────────────────────────────────────

    addTab: (label) => {
      const s = get();
      const layout = structuredClone(s.layout);
      const newTab: TabDef = {
        label: label ?? `Tab ${layout.tabs.length + 1}`,
        sections: [{ columns: [{ fields: [] }] }],
      };
      layout.tabs.push(newTab);
      set({ layout, isDirty: true });
    },

    removeTab: (tabIdx) => {
      const s = get();
      if (s.layout.tabs.length <= 1) return; // keep at least one tab
      const layout = structuredClone(s.layout);
      layout.tabs.splice(tabIdx, 1);
      set({ layout, isDirty: true });
    },

    updateTab: (tabIdx, patch) => {
      const s = get();
      const layout = structuredClone(s.layout);
      const tab = layout.tabs[tabIdx];
      if (!tab) return;
      Object.assign(tab, patch);
      set({ layout, isDirty: true });
    },

    addSection: (tabIdx, label) => {
      const s = get();
      const layout = structuredClone(s.layout);
      const tab = layout.tabs[tabIdx];
      if (!tab) return;
      const newSection: SectionDef = {
        ...(label ? { label } : {}),
        columns: [{ fields: [] }],
      };
      tab.sections.push(newSection);
      set({ layout, isDirty: true });
    },

    removeSection: (tabIdx, sectionIdx) => {
      const s = get();
      const tab = s.layout.tabs[tabIdx];
      if (!tab || tab.sections.length <= 1) return; // keep at least one section
      const layout = structuredClone(s.layout);
      layout.tabs[tabIdx]!.sections.splice(sectionIdx, 1);
      set({ layout, isDirty: true });
    },

    updateSection: (tabIdx, sectionIdx, patch) => {
      const s = get();
      const layout = structuredClone(s.layout);
      const section = layout.tabs[tabIdx]?.sections[sectionIdx];
      if (!section) return;
      Object.assign(section, patch);
      set({ layout, isDirty: true });
    },

    addColumn: (tabIdx, sectionIdx) => {
      const s = get();
      const layout = structuredClone(s.layout);
      const section = layout.tabs[tabIdx]?.sections[sectionIdx];
      if (!section) return;
      const newCol: ColumnDef = { fields: [] };
      section.columns.push(newCol);
      set({ layout, isDirty: true });
    },

    removeColumn: (tabIdx, sectionIdx, columnIdx) => {
      const s = get();
      const section = s.layout.tabs[tabIdx]?.sections[sectionIdx];
      if (!section || section.columns.length <= 1) return; // keep at least one column
      const layout = structuredClone(s.layout);
      layout.tabs[tabIdx]!.sections[sectionIdx]!.columns.splice(columnIdx, 1);
      set({ layout, isDirty: true });
    },

    updateColumnWidth: (tabIdx, sectionIdx, columnIdx, width) => {
      const s = get();
      const layout = structuredClone(s.layout);
      const col =
        layout.tabs[tabIdx]?.sections[sectionIdx]?.columns[columnIdx];
      if (!col) return;
      col.width = width;
      set({ layout, isDirty: true });
    },

    // ── Settings & permissions ────────────────────────────────────────────

    updateSettings: (patch) => {
      const s = get();
      set({ settings: { ...s.settings, ...patch }, isDirty: true });
    },

    setPermissions: (permissions) => set({ permissions, isDirty: true }),

    // ── Persistence ───────────────────────────────────────────────────────

    markClean: () => set({ isDirty: false }),

    hydrate: (data) =>
      set({
        name: data.name,
        app: data.app ?? null,
        module: data.module ?? "",
        isNew: false,
        layout: data.layout,
        fields: data.fields,
        settings: data.settings,
        permissions: data.permissions ?? [{ ...DEFAULT_PERMISSION }],
        selection: null,
        activeDrawer: null,
        mode: "schematic",
        isDirty: false,
      }),

    reset: () => set(initialState()),
  }),
);
