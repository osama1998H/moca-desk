import type { FieldType } from "@/api/types";
import type { PropertySchema } from "@/components/builder-kit/types";

// ── All known field types (storage + layout) ─────────────────────────────────

const ALL_FIELD_TYPES: FieldType[] = [
  // Storage types
  "Data",
  "Text",
  "LongText",
  "Markdown",
  "Code",
  "Int",
  "Float",
  "Currency",
  "Percent",
  "Date",
  "Datetime",
  "Time",
  "Duration",
  "Select",
  "Link",
  "DynamicLink",
  "Table",
  "TableMultiSelect",
  "Attach",
  "AttachImage",
  "Check",
  "Color",
  "Geolocation",
  "JSON",
  "Password",
  "Rating",
  "Signature",
  "Barcode",
  "HTMLEditor",
  // Layout-only types
  "SectionBreak",
  "ColumnBreak",
  "TabBreak",
  "HTML",
  "Button",
  "Heading",
];

// ── Field type groups used in dependsOn checks ───────────────────────────────

const TEXT_TYPES: FieldType[] = ["Data", "Text", "LongText", "Password"];
const NUMERIC_TYPES: FieldType[] = ["Int", "Float", "Currency", "Percent"];
const RELATIONAL_TYPES: FieldType[] = [
  "Link",
  "Table",
  "DynamicLink",
  "TableMultiSelect",
];

// ── Full 6-section schema shared across all field types ───────────────────────
// dependsOn functions on individual properties control per-type visibility.

const FIELD_PROPERTY_SCHEMA: PropertySchema = {
  sections: [
    // ── 1. Basic ──────────────────────────────────────────────────────────────
    {
      label: "Basic",
      properties: [
        {
          key: "label",
          label: "Label",
          type: "text",
        },
        {
          key: "name",
          label: "Name",
          type: "text",
          description: "snake_case identifier",
        },
        {
          key: "field_type",
          label: "Field Type",
          type: "select",
          options: ALL_FIELD_TYPES,
        },
      ],
    },

    // ── 2. Data ───────────────────────────────────────────────────────────────
    {
      label: "Data",
      properties: [
        // Options as textarea: only for Select
        {
          key: "options",
          label: "Options",
          type: "textarea",
          placeholder: "One option per line",
          dependsOn: (values) => values["field_type"] === "Select",
        },
        // Options as text (target DocType): only for relational types
        {
          key: "options",
          label: "Options",
          type: "text",
          placeholder: "Target DocType",
          dependsOn: (values) =>
            RELATIONAL_TYPES.includes(values["field_type"] as FieldType),
        },
        {
          key: "default",
          label: "Default",
          type: "text",
        },
        {
          key: "max_length",
          label: "Max Length",
          type: "number",
          dependsOn: (values) =>
            TEXT_TYPES.includes(values["field_type"] as FieldType),
        },
        {
          key: "min_value",
          label: "Min Value",
          type: "number",
          dependsOn: (values) =>
            NUMERIC_TYPES.includes(values["field_type"] as FieldType),
        },
        {
          key: "max_value",
          label: "Max Value",
          type: "number",
          dependsOn: (values) =>
            NUMERIC_TYPES.includes(values["field_type"] as FieldType),
        },
      ],
    },

    // ── 3. Validation ─────────────────────────────────────────────────────────
    {
      label: "Validation",
      properties: [
        {
          key: "required",
          label: "Required",
          type: "boolean",
        },
        {
          key: "unique",
          label: "Unique",
          type: "boolean",
        },
        {
          key: "validation_regex",
          label: "Validation Regex",
          type: "text",
        },
      ],
    },

    // ── 4. Display ────────────────────────────────────────────────────────────
    {
      label: "Display",
      properties: [
        {
          key: "read_only",
          label: "Read Only",
          type: "boolean",
        },
        {
          key: "hidden",
          label: "Hidden",
          type: "boolean",
        },
        {
          key: "depends_on",
          label: "Depends On",
          type: "text",
          description: "JS expression",
        },
        {
          key: "in_list_view",
          label: "In List View",
          type: "boolean",
        },
        {
          key: "in_filter",
          label: "In Filter",
          type: "boolean",
        },
        {
          key: "in_preview",
          label: "In Preview",
          type: "boolean",
        },
      ],
    },

    // ── 5. Search (collapsed by default) ─────────────────────────────────────
    {
      label: "Search",
      collapsed: true,
      properties: [
        {
          key: "searchable",
          label: "Searchable",
          type: "boolean",
        },
        {
          key: "filterable",
          label: "Filterable",
          type: "boolean",
        },
        {
          key: "db_index",
          label: "DB Index",
          type: "boolean",
        },
        {
          key: "full_text_index",
          label: "Full Text Index",
          type: "boolean",
        },
      ],
    },

    // ── 6. API (collapsed by default) ────────────────────────────────────────
    {
      label: "API",
      collapsed: true,
      properties: [
        {
          key: "in_api",
          label: "In API",
          type: "boolean",
        },
        {
          key: "api_read_only",
          label: "API Read Only",
          type: "boolean",
        },
        {
          key: "api_alias",
          label: "API Alias",
          type: "text",
        },
      ],
    },
  ],
};

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Returns the property schema for a given field type.
 * All field types share the same 6-section schema; per-type visibility is
 * controlled by `dependsOn` functions on individual property definitions.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getFieldPropertySchema(_fieldType: FieldType): PropertySchema {
  return FIELD_PROPERTY_SCHEMA;
}

/** Property schema for Section nodes (label, collapsible, collapsed_by_default). */
export const SECTION_PROPERTY_SCHEMA: PropertySchema = {
  sections: [
    {
      label: "Section",
      properties: [
        {
          key: "label",
          label: "Label",
          type: "text",
        },
        {
          key: "collapsible",
          label: "Collapsible",
          type: "boolean",
        },
        {
          key: "collapsed_by_default",
          label: "Collapsed by Default",
          type: "boolean",
        },
      ],
    },
  ],
};

/** Property schema for Tab nodes (label). */
export const TAB_PROPERTY_SCHEMA: PropertySchema = {
  sections: [
    {
      label: "Tab",
      properties: [
        {
          key: "label",
          label: "Label",
          type: "text",
        },
      ],
    },
  ],
};

/** Property schema for Column nodes (width). */
export const COLUMN_PROPERTY_SCHEMA: PropertySchema = {
  sections: [
    {
      label: "Column",
      properties: [
        {
          key: "width",
          label: "Width",
          type: "number",
        },
      ],
    },
  ],
};
