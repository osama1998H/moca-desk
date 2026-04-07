// Runtime registry for custom page components registered by app extensions.

export interface PageRegistration {
  path: string;
  component: React.ComponentType;
  label?: string;
  icon?: string;
}

const customPages = new Map<string, PageRegistration>();

/**
 * Register a custom page at the given route path.
 * Apps call this at startup (via desk-manifest.json / setup.ts) so the Desk
 * adds the custom route when rendering.
 */
export function registerPage(
  path: string,
  component: React.ComponentType,
  options?: { label?: string; icon?: string },
): void {
  customPages.set(path, { path, component, ...options });
}

/**
 * Return all registered custom pages.
 * Internal to the Desk — consumed by the router to inject app routes.
 */
export function getCustomPages(): PageRegistration[] {
  return [...customPages.values()];
}
