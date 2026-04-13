/** A reversible mutation. Every state change in a builder goes through a Command. */
export interface Command {
  id: string;
  label: string;
  execute(): void;
  undo(): void;
}

/** Schema for the PropertyPanel — each builder supplies its own per node type. */
export interface PropertySchema {
  sections: PropertySection[];
}

export interface PropertySection {
  label: string;
  collapsed?: boolean;
  properties: PropertyDef[];
}

export interface PropertyDef {
  key: string;
  label: string;
  type: "text" | "number" | "boolean" | "select" | "code" | "link" | "textarea";
  options?: string[];
  dependsOn?: (values: Record<string, unknown>) => boolean;
  description?: string;
  placeholder?: string;
}

export type DrawerId = string;

export interface SelectedNode {
  type: string;
  id: string;
}
