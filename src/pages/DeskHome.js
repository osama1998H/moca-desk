import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from "@/providers/AuthProvider";
export function DeskHome() {
    const { user } = useAuth();
    return (_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-semibold text-gray-900", children: "Welcome to Moca Desk" }), user && (_jsxs("p", { className: "mt-2 text-gray-600", children: ["Signed in as ", user.full_name || user.email] }))] }));
}
