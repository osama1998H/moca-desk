import type { FieldType, NamingStrategy } from "@/api/types";

// ── Builder-specific types ──────────────────────────────────────────────────

/** DocType-level settings editable in the builder. */
export interface DocTypeSettings {
  naming_rule: NamingStrategy;
  title_field: string;
  sort_field: string;
  sort_order: "asc" | "desc";
  search_fields: string[];
  image_field: string;
  is_submittable: boolean;
  is_single: boolean;
  is_child_table: boolean;
  is_virtual: boolean;
  track_changes: boolean;
}

/** A single row in the permissions table. */
export interface PermissionRule {
  role: string;
  read: boolean;
  write: boolean;
  create: boolean;
  delete: boolean;
  submit: boolean;
  cancel: boolean;
}

/** Identifies the currently selected element in the builder canvas. */
export interface BuilderSelection {
  type: "field" | "section" | "column" | "tab";
  id: string;
}

/** Which drawer panel (if any) is open on the right side. */
export type ActiveDrawer = "fields" | "settings" | "permissions" | null;

// ── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Convert a PascalCase / camelCase FieldType to snake_case.
 * "LongText" -> "long_text", "DynamicLink" -> "dynamic_link", "HTML" -> "html"
 */
function toSnakeCase(s: string): string {
  return s
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .toLowerCase();
}

/**
 * Generate a unique snake_case field name from a FieldType.
 *
 * Examples (with empty existingNames):
 *   "Data"        -> "data"
 *   "LongText"    -> "long_text"
 *   "DynamicLink" -> "dynamic_link"
 *
 * If the name already exists, appends _1, _2, ... until unique.
 */
export function generateFieldName(
  fieldType: FieldType,
  existingNames: Set<string>,
): string {
  const base = toSnakeCase(fieldType);
  if (!existingNames.has(base)) return base;

  let n = 1;
  while (existingNames.has(`${base}_${n}`)) n++;
  return `${base}_${n}`;
}

// ── Default values ──────────────────────────────────────────────────────────

export const DEFAULT_SETTINGS: DocTypeSettings = {
  naming_rule: { rule: "uuid" },
  title_field: "",
  sort_field: "",
  sort_order: "desc",
  search_fields: [],
  image_field: "",
  is_submittable: false,
  is_single: false,
  is_child_table: false,
  is_virtual: false,
  track_changes: true,
};

export const DEFAULT_PERMISSION: PermissionRule = {
  role: "System Manager",
  read: true,
  write: true,
  create: true,
  delete: true,
  submit: false,
  cancel: false,
};
