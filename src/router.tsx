import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { RequireAuth } from "@/components/RequireAuth";
import { DeskLayout } from "@/layouts/DeskLayout";
import { Login } from "@/pages/Login";
import { DeskHome } from "@/pages/DeskHome";
import { getCustomPages } from "@/lib/pageRegistry";

const ListView = lazy(() => import("@/pages/ListView"));
const FormView = lazy(() => import("@/pages/FormView"));
const ReportView = lazy(() => import("@/pages/ReportView"));
const DashboardView = lazy(() => import("@/pages/DashboardView"));
const DocTypeBuilder = lazy(() => import("@/pages/DocTypeBuilder"));

function PageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200" />
      <div className="h-64 w-full animate-pulse rounded-lg bg-gray-100" />
    </div>
  );
}

export function createRouter() {
  const customRoutes = getCustomPages().map((page) => ({
    path: page.path.replace(/^\/desk\/app\//, ""),
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <page.component />
      </Suspense>
    ),
  }));

  return createBrowserRouter([
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
              path: "doctype-builder",
              element: (
                <Suspense fallback={<PageSkeleton />}>
                  <DocTypeBuilder />
                </Suspense>
              ),
            },
            {
              path: "doctype-builder/:name",
              element: (
                <Suspense fallback={<PageSkeleton />}>
                  <DocTypeBuilder />
                </Suspense>
              ),
            },
            ...customRoutes,
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
}
