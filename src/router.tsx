import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { RequireAuth } from "@/components/RequireAuth";
import { DeskLayout } from "@/layouts/DeskLayout";
import { Login } from "@/pages/Login";
import { DeskHome } from "@/pages/DeskHome";

const ListView = lazy(() => import("@/pages/ListView"));
const FormView = lazy(() => import("@/pages/FormView"));
const ReportView = lazy(() => import("@/pages/ReportView"));
const DashboardView = lazy(() => import("@/pages/DashboardView"));

function PageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200" />
      <div className="h-64 w-full animate-pulse rounded-lg bg-gray-100" />
    </div>
  );
}

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
          {
            path: "report/:name",
            element: (
              <Suspense fallback={<PageSkeleton />}>
                <ReportView />
              </Suspense>
            ),
          },
          {
            path: "dashboard/:name",
            element: (
              <Suspense fallback={<PageSkeleton />}>
                <DashboardView />
              </Suspense>
            ),
          },
          {
            path: ":doctype",
            element: (
              <Suspense fallback={<PageSkeleton />}>
                <ListView />
              </Suspense>
            ),
          },
          {
            path: ":doctype/new",
            element: (
              <Suspense fallback={<PageSkeleton />}>
                <FormView />
              </Suspense>
            ),
          },
          {
            path: ":doctype/:name",
            element: (
              <Suspense fallback={<PageSkeleton />}>
                <FormView />
              </Suspense>
            ),
          },
        ],
      },
      {
        index: true,
        element: <Navigate to="/desk/app" replace />,
      },
    ],
  },
]);
