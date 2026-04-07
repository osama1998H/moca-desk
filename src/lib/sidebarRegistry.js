// Runtime registry for custom sidebar items registered by app extensions.
const customSidebarItems = [];
/**
 * Register a sidebar navigation item or group.
 * Apps call this at startup (via desk-manifest.json / setup.ts) so the Desk
 * renders the custom navigation entry in the sidebar.
 */
export function registerSidebarItem(item) {
    customSidebarItems.push(item);
}
/**
 * Return all registered custom sidebar items, sorted by order.
 * Internal to the Desk — consumed by the Sidebar component.
 */
export function getCustomSidebarItems() {
    return [...customSidebarItems].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}
