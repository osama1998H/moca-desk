// @osama1998h/desk — Public API for app desk extensions.
//
// Apps import from this package to register custom field types, pages,
// sidebar items, dashboard widgets, and compose UI extensions for the Moca Desk.
// App factory
export { createDeskApp } from "./createApp";
export { useDeskConfig } from "./config";
// Vite plugin (re-exported for convenience; prefer "@osama1998h/desk/vite" entry)
export { mocaDeskPlugin } from "./vite-plugin";
// Field type registry
export { registerFieldType } from "./lib/fieldTypeRegistry";
// Page registry
export { registerPage } from "./lib/pageRegistry";
// Sidebar registry
export { registerSidebarItem } from "./lib/sidebarRegistry";
// Widget registry
export { registerDashboardWidget } from "./lib/widgetRegistry";
// Components
export { FieldRenderer } from "./components/fields/FieldRenderer";
// Hooks
export { useAuth } from "./providers/AuthProvider";
export { useWebSocket } from "./providers/WebSocketProvider";
export { useMetaType } from "./providers/MetaProvider";
export { useDocument, useDocList } from "./providers/DocProvider";
export { useRealtimeDoc } from "./hooks/useRealtimeDoc";
export { useDocVersions } from "./hooks/useDocVersions";
