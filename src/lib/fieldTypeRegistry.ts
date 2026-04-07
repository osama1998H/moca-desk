import type { FieldProps } from "@/components/fields/types";
import { FIELD_TYPE_MAP } from "@/components/fields/types";

// Runtime registry for custom field type components registered by app extensions.
const customFieldTypes = new Map<string, React.ComponentType<FieldProps>>();

/**
 * Register a custom field type component for use in FormView.
 * Apps call this at startup (typically in desk/setup.ts) so the Desk
 * renders the custom component when a field definition uses this type.
 *
 * Built-in types take precedence — a dev-mode warning is logged on collision.
 */
export function registerFieldType(
  name: string,
  component: React.ComponentType<FieldProps>,
): void {
  if (import.meta.env.DEV && name in FIELD_TYPE_MAP) {
    console.warn(
      `[moca] registerFieldType: "${name}" collides with a built-in field type. ` +
        `The built-in component will take precedence.`,
    );
  }
  customFieldTypes.set(name, component);
}

/**
 * Look up a custom field type component by name.
 * Returns undefined if no custom component is registered for this type.
 * Internal to the Desk — not exported from @osama1998h/desk.
 */
export function getCustomFieldType(
  name: string,
): React.ComponentType<FieldProps> | undefined {
  return customFieldTypes.get(name);
}
