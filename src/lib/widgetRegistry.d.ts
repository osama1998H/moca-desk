export interface WidgetRegistration {
    name: string;
    component: React.ComponentType;
    label?: string;
}
/**
 * Register a custom dashboard widget.
 * Apps call this at startup (via desk-manifest.json / setup.ts) so the Desk
 * renders the custom widget in dashboard views.
 */
export declare function registerDashboardWidget(name: string, component: React.ComponentType, options?: {
    label?: string;
}): void;
/**
 * Return all registered custom dashboard widgets.
 * Internal to the Desk — consumed by the DashboardView component.
 */
export declare function getCustomWidgets(): WidgetRegistration[];
