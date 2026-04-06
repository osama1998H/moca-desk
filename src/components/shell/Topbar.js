import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useParams } from "react-router";
import { useAuth } from "@/providers/AuthProvider";
import { useWebSocket } from "@/providers/WebSocketProvider";
import { useMetaType } from "@/providers/MetaProvider";
import { cn } from "@/lib/utils";
import { ChevronRightIcon, LogOutIcon } from "lucide-react";
export function Topbar() {
    const { doctype, name } = useParams();
    const { user, logout } = useAuth();
    const { connectionState } = useWebSocket();
    // Only fetch meta when a doctype is present
    const { data: meta } = useMetaType(doctype ?? "");
    // Build breadcrumb segments
    const crumbs = [
        { label: "Home", to: "/desk/app" },
    ];
    if (doctype) {
        crumbs.push({
            label: meta?.label || doctype,
            to: name ? `/desk/app/${doctype}` : undefined,
        });
    }
    if (name) {
        crumbs.push({
            label: name === "new" ? "New" : name,
        });
    }
    return (_jsxs("header", { className: "flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6", children: [_jsx("nav", { className: "flex items-center gap-1 text-sm", children: crumbs.map((crumb, i) => (_jsxs("span", { className: "flex items-center gap-1", children: [i > 0 && (_jsx(ChevronRightIcon, { className: "size-3.5 text-gray-400" })), crumb.to ? (_jsx(Link, { to: crumb.to, className: "text-gray-500 hover:text-gray-700", children: crumb.label })) : (_jsx("span", { className: "font-medium text-gray-900", children: crumb.label }))] }, i))) }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { title: connectionState, className: cn("inline-block size-1.5 rounded-full", connectionState === "connected" && "bg-green-500", (connectionState === "connecting" ||
                            connectionState === "reconnecting") &&
                            "animate-pulse bg-amber-500", connectionState === "disconnected" && "bg-gray-400") }), _jsx("span", { className: "text-sm text-gray-600", children: user?.full_name ?? user?.email }), _jsxs("button", { type: "button", onClick: () => void logout(), className: "inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700", children: [_jsx(LogOutIcon, { className: "size-3.5" }), "Logout"] })] })] }));
}
