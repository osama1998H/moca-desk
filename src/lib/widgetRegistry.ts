// Runtime registry for custom dashboard widgets registered by app extensions.

export interface WidgetRegistration {
  name: string;
  component: React.ComponentType;
  label?: string;
}

const customWidgets = new Map<string, WidgetRegistration>();

/**
 * Register a custom dashboard widget.
 * Apps call this at startup (via desk-manifest.json / setup.ts) so the Desk
 * renders the custom widget in dashboard views.
 */
export function registerDashboardWidget(
  name: string,
  component: React.ComponentType,
  options?: { label?: string },
): void {
  customWidgets.set(name, { name, component, ...options });
}

/**
 * Return all registered custom dashboard widgets.
 * Internal to the Desk — consumed by the DashboardView component.
 */
export function getCustomWidgets(): WidgetRegistration[] {
  return [...customWidgets.values()];
}
