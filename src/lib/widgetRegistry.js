// Runtime registry for custom dashboard widgets registered by app extensions.
const customWidgets = new Map();
/**
 * Register a custom dashboard widget.
 * Apps call this at startup (via desk-manifest.json / setup.ts) so the Desk
 * renders the custom widget in dashboard views.
 */
export function registerDashboardWidget(name, component, options) {
    customWidgets.set(name, { name, component, ...options });
}
/**
 * Return all registered custom dashboard widgets.
 * Internal to the Desk — consumed by the DashboardView component.
 */
export function getCustomWidgets() {
    return [...customWidgets.values()];
}
