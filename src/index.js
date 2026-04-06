// @moca/desk — Public API for app desk extensions.
//
// Apps import from this package to register custom field types, access
// hooks, and compose UI extensions for the Moca Desk.
// Field type registry
export { registerFieldType } from "./lib/fieldTypeRegistry";
// Components
export { FieldRenderer } from "./components/fields/FieldRenderer";
// Hooks
export { useAuth } from "./providers/AuthProvider";
export { useMetaType } from "./providers/MetaProvider";
export { useDocument, useDocList } from "./providers/DocProvider";
