import { jsx as _jsx } from "react/jsx-runtime";
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
                element: _jsx(Login, {}),
            },
            {
                path: "app",
                element: (_jsx(RequireAuth, { children: _jsx(DeskLayout, {}) })),
                children: [
                    { index: true, element: _jsx(DeskHome, {}) },
                    // Future routes (MS-17-T4):
                    // { path: ":doctype", element: <ListView /> },
                    // { path: ":doctype/new", element: <FormView /> },
                    // { path: ":doctype/:name", element: <FormView /> },
                ],
            },
            {
                index: true,
                element: _jsx(Navigate, { to: "/desk/app", replace: true }),
            },
        ],
    },
]);
