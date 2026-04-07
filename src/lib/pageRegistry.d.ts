export interface PageRegistration {
    path: string;
    component: React.ComponentType;
    label?: string;
    icon?: string;
}
/**
 * Register a custom page at the given route path.
 * Apps call this at startup (via desk-manifest.json / setup.ts) so the Desk
 * adds the custom route when rendering.
 */
export declare function registerPage(path: string, component: React.ComponentType, options?: {
    label?: string;
    icon?: string;
}): void;
/**
 * Return all registered custom pages.
 * Internal to the Desk — consumed by the router to inject app routes.
 */
export declare function getCustomPages(): PageRegistration[];
