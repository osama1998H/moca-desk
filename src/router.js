import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { RequireAuth } from "@/components/RequireAuth";
import { DeskLayout } from "@/layouts/DeskLayout";
import { Login } from "@/pages/Login";
import { DeskHome } from "@/pages/DeskHome";
const ListView = lazy(() => import("@/pages/ListView"));
const FormView = lazy(() => import("@/pages/FormView"));
function PageSkeleton() {
    return (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "h-8 w-48 animate-pulse rounded-lg bg-gray-200" }), _jsx("div", { className: "h-64 w-full animate-pulse rounded-lg bg-gray-100" })] }));
}
export const router = createBrowserRouter([
    {
        path: "/desk",
        children: [
            {
                path: "login",
                element: _jsx(Login, {}),
            },
            {
                path: "app",
                element: (_jsx(RequireAuth, { children: _jsx(DeskLayout, {}) })),
                children: [
                    { index: true, element: _jsx(DeskHome, {}) },
                    {
                        path: ":doctype",
                        element: (_jsx(Suspense, { fallback: _jsx(PageSkeleton, {}), children: _jsx(ListView, {}) })),
                    },
                    {
                        path: ":doctype/new",
                        element: (_jsx(Suspense, { fallback: _jsx(PageSkeleton, {}), children: _jsx(FormView, {}) })),
                    },
                    {
                        path: ":doctype/:name",
                        element: (_jsx(Suspense, { fallback: _jsx(PageSkeleton, {}), children: _jsx(FormView, {}) })),
                    },
                ],
            },
            {
                index: true,
                element: _jsx(Navigate, { to: "/desk/app", replace: true }),
            },
        ],
    },
]);
