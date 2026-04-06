import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Loader2Icon } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, } from "recharts";
import { useDashboardWidget } from "@/providers/DashboardProvider";
export function ChartWidget({ dashboardName, widgetIdx, config, }) {
    const { data, isLoading, error } = useDashboardWidget(dashboardName, widgetIdx);
    const label = config.label ?? "Chart";
    const chartType = (config.chart_type ?? "bar").toLowerCase();
    const chartData = data?.data ?? [];
    return (_jsxs("div", { className: "rounded-lg border border-gray-200 bg-white p-5", children: [_jsx("p", { className: "mb-3 text-sm font-medium text-gray-700", children: label }), isLoading ? (_jsx("div", { className: "flex h-48 items-center justify-center", children: _jsx(Loader2Icon, { className: "size-5 animate-spin text-gray-400" }) })) : error ? (_jsx("p", { className: "text-sm text-red-500", children: "Failed to load chart" })) : chartData.length === 0 ? (_jsx("p", { className: "text-sm text-gray-400", children: "No data" })) : (_jsx(ResponsiveContainer, { width: "100%", height: 200, children: chartType === "line" ? (_jsxs(LineChart, { data: chartData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "period", tick: { fontSize: 11 }, tickFormatter: formatPeriod }), _jsx(YAxis, { tick: { fontSize: 11 } }), _jsx(Tooltip, { labelFormatter: formatPeriod }), _jsx(Line, { type: "monotone", dataKey: "value", stroke: "#3b82f6", strokeWidth: 2 })] })) : (_jsxs(BarChart, { data: chartData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "period", tick: { fontSize: 11 }, tickFormatter: formatPeriod }), _jsx(YAxis, { tick: { fontSize: 11 } }), _jsx(Tooltip, { labelFormatter: formatPeriod }), _jsx(Bar, { dataKey: "value", fill: "#3b82f6" })] })) }))] }));
}
function formatPeriod(value) {
    if (!value)
        return "";
    const s = String(value);
    // Truncate ISO date to YYYY-MM-DD
    if (s.length > 10 && s.includes("T"))
        return s.slice(0, 10);
    return s;
}
