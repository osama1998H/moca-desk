import type { FieldProps } from "@/components/fields/types";
/**
 * Register a custom field type component for use in FormView.
 * Apps call this at startup (typically in desk/setup.ts) so the Desk
 * renders the custom component when a field definition uses this type.
 *
 * Built-in types take precedence — a dev-mode warning is logged on collision.
 */
export declare function registerFieldType(name: string, component: React.ComponentType<FieldProps>): void;
/**
 * Look up a custom field type component by name.
 * Returns undefined if no custom component is registered for this type.
 * Internal to the Desk — not exported from @osama1998h/desk.
 */
export declare function getCustomFieldType(name: string): React.ComponentType<FieldProps> | undefined;
