import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "@/providers/AuthProvider";
export function RequireAuth({ children }) {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();
    if (isLoading) {
        return (_jsx("div", { className: "flex h-screen items-center justify-center", children: _jsx("div", { className: "text-gray-500", children: "Loading..." }) }));
    }
    if (!isAuthenticated) {
        const returnTo = location.pathname + location.search;
        return (_jsx(Navigate, { to: `/desk/login?returnTo=${encodeURIComponent(returnTo)}`, replace: true }));
    }
    return children;
}
