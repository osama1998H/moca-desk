import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Loader2Icon } from "lucide-react";
import { useDashboardWidget } from "@/providers/DashboardProvider";
export function NumberCard({ dashboardName, widgetIdx, config, }) {
    const { data, isLoading, error } = useDashboardWidget(dashboardName, widgetIdx);
    const label = config.label ?? "Total";
    const color = config.color ?? "#3b82f6";
    return (_jsxs("div", { className: "rounded-lg border border-gray-200 bg-white p-5", children: [_jsx("div", { className: "mb-2 h-1 w-10 rounded-full", style: { backgroundColor: color } }), _jsx("p", { className: "text-sm text-gray-500", children: label }), isLoading ? (_jsx(Loader2Icon, { className: "mt-2 size-5 animate-spin text-gray-400" })) : error ? (_jsx("p", { className: "mt-1 text-sm text-red-500", children: "Failed to load" })) : (_jsx("p", { className: "mt-1 text-3xl font-semibold text-gray-900", children: formatNumber(data?.value) }))] }));
}
function formatNumber(value) {
    if (value == null)
        return "0";
    if (typeof value === "number")
        return value.toLocaleString();
    return String(value);
}
