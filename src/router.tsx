import { createBrowserRouter, Navigate } from "react-router";
import { RequireAuth } from "@/components/RequireAuth";
import { DeskLayout } from "@/layouts/DeskLayout";
import { Login } from "@/pages/Login";
import { DeskHome } from "@/pages/DeskHome";

export const router = createBrowserRouter([
  {
    path: "/desk",
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "app",
        element: (
          <RequireAuth>
            <DeskLayout />
          </RequireAuth>
        ),
        children: [
          { index: true, element: <DeskHome /> },
          // Future routes (MS-17-T4):
          // { path: ":doctype", element: <ListView /> },
          // { path: ":doctype/new", element: <FormView /> },
          // { path: ":doctype/:name", element: <FormView /> },
        ],
      },
      {
        index: true,
        element: <Navigate to="/desk/app" replace />,
      },
    ],
  },
]);
