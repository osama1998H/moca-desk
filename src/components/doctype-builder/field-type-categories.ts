import type { FieldType } from "@/api/types";

export interface FieldTypeCategory {
  label: string;
  types: { type: FieldType; label: string }[];
}

export const FIELD_TYPE_CATEGORIES: FieldTypeCategory[] = [
  {
    label: "Text",
    types: [
      { type: "Data", label: "Data" },
      { type: "Text", label: "Text" },
      { type: "LongText", label: "Long Text" },
      { type: "Markdown", label: "Markdown" },
      { type: "Code", label: "Code" },
      { type: "HTMLEditor", label: "HTML Editor" },
    ],
  },
  {
    label: "Number",
    types: [
      { type: "Int", label: "Integer" },
      { type: "Float", label: "Float" },
      { type: "Currency", label: "Currency" },
      { type: "Percent", label: "Percent" },
      { type: "Rating", label: "Rating" },
    ],
  },
  {
    label: "Date & Time",
    types: [
      { type: "Date", label: "Date" },
      { type: "Datetime", label: "Date Time" },
      { type: "Time", label: "Time" },
      { type: "Duration", label: "Duration" },
    ],
  },
  {
    label: "Selection",
    types: [
      { type: "Select", label: "Select" },
      { type: "Link", label: "Link" },
      { type: "DynamicLink", label: "Dynamic Link" },
    ],
  },
  {
    label: "Relations",
    types: [
      { type: "Table", label: "Table" },
      { type: "TableMultiSelect", label: "Table MultiSelect" },
    ],
  },
  {
    label: "Media",
    types: [
      { type: "Attach", label: "Attach" },
      { type: "AttachImage", label: "Attach Image" },
      { type: "Color", label: "Color" },
      { type: "Signature", label: "Signature" },
      { type: "Barcode", label: "Barcode" },
    ],
  },
  {
    label: "Interactive",
    types: [
      { type: "Check", label: "Checkbox" },
      { type: "Password", label: "Password" },
    ],
  },
  {
    label: "Display",
    types: [
      { type: "HTML", label: "HTML" },
      { type: "Heading", label: "Heading" },
      { type: "Button", label: "Button" },
    ],
  },
];
