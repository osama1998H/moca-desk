import { RouterProvider } from "react-router";
import type { createBrowserRouter } from "react-router";

export function App({
  router,
}: {
  router: ReturnType<typeof createBrowserRouter>;
}) {
  return <RouterProvider router={router} />;
}
