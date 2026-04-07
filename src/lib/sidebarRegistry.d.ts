export interface SidebarChildItem {
    label: string;
    path: string;
}
export interface SidebarItem {
    label: string;
    icon?: string;
    path?: string;
    children?: SidebarChildItem[];
    /** Sort order among custom items. Lower = higher in sidebar. Default: 999 */
    order?: number;
}
/**
 * Register a sidebar navigation item or group.
 * Apps call this at startup (via desk-manifest.json / setup.ts) so the Desk
 * renders the custom navigation entry in the sidebar.
 */
export declare function registerSidebarItem(item: SidebarItem): void;
/**
 * Return all registered custom sidebar items, sorted by order.
 * Internal to the Desk — consumed by the Sidebar component.
 */
export declare function getCustomSidebarItems(): SidebarItem[];
