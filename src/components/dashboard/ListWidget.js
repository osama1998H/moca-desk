import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router";
import { Loader2Icon } from "lucide-react";
import { useDashboardWidget } from "@/providers/DashboardProvider";
export function ListWidget({ dashboardName, widgetIdx, config, }) {
    const { data, isLoading, error } = useDashboardWidget(dashboardName, widgetIdx);
    const label = config.label ?? "Recent";
    const doctype = config.doctype ?? "";
    const items = data?.data ?? [];
    return (_jsxs("div", { className: "rounded-lg border border-gray-200 bg-white p-5", children: [_jsx("p", { className: "mb-3 text-sm font-medium text-gray-700", children: label }), isLoading ? (_jsx("div", { className: "flex h-24 items-center justify-center", children: _jsx(Loader2Icon, { className: "size-5 animate-spin text-gray-400" }) })) : error ? (_jsx("p", { className: "text-sm text-red-500", children: "Failed to load" })) : items.length === 0 ? (_jsx("p", { className: "text-sm text-gray-400", children: "No records" })) : (_jsx("ul", { className: "divide-y divide-gray-100", children: items.map((item, i) => (_jsx("li", { children: _jsxs(Link, { to: `/desk/app/${doctype}/${encodeURIComponent(String(item.name ?? ""))}`, className: "flex items-center justify-between py-2 text-sm hover:text-blue-600", children: [_jsx("span", { className: "truncate text-gray-700", children: item.name != null ? String(item.name) : "" }), item.modified != null && (_jsx("span", { className: "ml-2 shrink-0 text-xs text-gray-400", children: String(item.modified).slice(0, 10) }))] }) }, i))) }))] }));
}
