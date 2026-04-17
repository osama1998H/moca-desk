import { beforeEach, describe, expect, it } from "vitest";

import { useDocTypeBuilderStore } from "./doctype-builder-store";

const baseSettings = {
  naming_rule: { rule: "uuid" as const },
  title_field: "",
  sort_field: "",
  sort_order: "desc" as const,
  search_fields: [],
  image_field: "",
  is_submittable: false,
  is_single: false,
  is_child_table: false,
  is_virtual: false,
  track_changes: true,
};

describe("doctype-builder-store.stageNew", () => {
  beforeEach(() => {
    useDocTypeBuilderStore.getState().reset();
  });

  it("populates name/app/module/settings and marks the doctype new", () => {
    useDocTypeBuilderStore.getState().stageNew({
      name: "Customer",
      app: "acme",
      module: "crm",
      settings: { ...baseSettings, is_submittable: true },
    });

    const s = useDocTypeBuilderStore.getState();
    expect(s.name).toBe("Customer");
    expect(s.app).toBe("acme");
    expect(s.module).toBe("crm");
    expect(s.settings.is_submittable).toBe(true);
    expect(s.isNew).toBe(true);
    expect(s.isDirty).toBe(false);
    expect(Object.keys(s.fields)).toHaveLength(0);
    expect(s.layout.tabs).toHaveLength(1);
    expect(s.layout.tabs[0]?.label).toBe("Details");
  });

  it("resets any prior state before staging", () => {
    // Pretend the store has stale data from a previous edit.
    useDocTypeBuilderStore.getState().hydrate({
      name: "Old",
      app: "old-app",
      module: "old",
      layout: {
        tabs: [{ label: "Old Tab", sections: [{ columns: [{ fields: [] }] }] }],
      },
      fields: {},
      settings: baseSettings,
    });
    expect(useDocTypeBuilderStore.getState().isNew).toBe(false);

    useDocTypeBuilderStore.getState().stageNew({
      name: "Fresh",
      app: "acme",
      module: "crm",
      settings: baseSettings,
    });

    const s = useDocTypeBuilderStore.getState();
    expect(s.name).toBe("Fresh");
    expect(s.isNew).toBe(true);
    expect(s.layout.tabs[0]?.label).toBe("Details");
  });

  it("keeps isNew=true after adding a field (first save is POST)", () => {
    useDocTypeBuilderStore.getState().stageNew({
      name: "Customer",
      app: "acme",
      module: "crm",
      settings: baseSettings,
    });
    useDocTypeBuilderStore.getState().addField("Data", 0, 0, 0);

    expect(useDocTypeBuilderStore.getState().isNew).toBe(true);
    expect(useDocTypeBuilderStore.getState().isDirty).toBe(true);
  });
});
