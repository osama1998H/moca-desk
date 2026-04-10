// @osama1998h/desk — Public API for app desk extensions.
//
// Apps import from this package to register custom field types, pages,
// sidebar items, dashboard widgets, and compose UI extensions for the Moca Desk.

// App factory
export { createDeskApp } from "./createApp";
export type { DeskAppConfig, DeskApp } from "./createApp";

// Configuration
export type { DeskConfig } from "./config";
export { useDeskConfig } from "./config";

// API client utilities
export { setSite } from "./api/client";

// Vite plugin — available only via "@osama1998h/desk/vite" entry point.
// NOT re-exported here to avoid pulling Node.js-only dependencies
// (@tailwindcss/vite, @tailwindcss/oxide) into the client bundle.
export type { MocaDeskPluginOptions } from "./vite-plugin";

// Field type registry
export { registerFieldType } from "./lib/fieldTypeRegistry";

// Page registry
export { registerPage } from "./lib/pageRegistry";
export type { PageRegistration } from "./lib/pageRegistry";

// Sidebar registry
export { registerSidebarItem } from "./lib/sidebarRegistry";
export type { SidebarItem, SidebarChildItem } from "./lib/sidebarRegistry";

// Widget registry
export { registerDashboardWidget } from "./lib/widgetRegistry";
export type { WidgetRegistration } from "./lib/widgetRegistry";

// Types
export type { FieldProps, LayoutFieldProps } from "./components/fields/types";
export type { FieldType, FieldDef, MetaType, DocRecord } from "./api/types";

// Components
export { FieldRenderer } from "./components/fields/FieldRenderer";

// Hooks
export { useAuth } from "./providers/AuthProvider";
export { useWebSocket } from "./providers/WebSocketProvider";
export { useMetaType } from "./providers/MetaProvider";
export { useDocument, useDocList } from "./providers/DocProvider";
export { useRealtimeDoc } from "./hooks/useRealtimeDoc";
export { useDocVersions } from "./hooks/useDocVersions";

// Real-time types
export type {
  DocUpdateEvent,
  WsConnectionState,
  VersionRecord,
} from "./api/ws-types";
