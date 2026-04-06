// @moca/desk — Public API for app desk extensions.
//
// Apps import from this package to register custom field types, access
// hooks, and compose UI extensions for the Moca Desk.

// Field type registry
export { registerFieldType } from "./lib/fieldTypeRegistry";

// Types
export type { FieldProps, LayoutFieldProps } from "./components/fields/types";
export type { FieldType, FieldDef, MetaType, DocRecord } from "./api/types";

// Components
export { FieldRenderer } from "./components/fields/FieldRenderer";

// Hooks
export { useAuth } from "./providers/AuthProvider";
export { useMetaType } from "./providers/MetaProvider";
export { useDocument, useDocList } from "./providers/DocProvider";
