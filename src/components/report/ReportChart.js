import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, } from "recharts";
const COLORS = [
    "#3b82f6",
    "#ef4444",
    "#22c55e",
    "#f59e0b",
    "#8b5cf6",
    "#06b6d4",
    "#ec4899",
    "#14b8a6",
];
export function ReportChart({ config, columns, data }) {
    const { labelCol, numericCols } = useMemo(() => {
        const label = columns[0];
        const numeric = columns.filter((c) => c !== label &&
            ["Int", "Float", "Currency", "Percent"].includes(c.field_type));
        return { labelCol: label, numericCols: numeric.length > 0 ? numeric : columns.slice(1) };
    }, [columns]);
    if (data.length === 0)
        return null;
    const chartType = config.type?.toLowerCase() ?? "bar";
    if (chartType === "pie") {
        const valueCol = numericCols[0];
        if (!valueCol)
            return null;
        return (_jsx("div", { className: "mb-6 rounded-lg border border-gray-200 bg-white p-4", children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: data, dataKey: valueCol.field_name, nameKey: labelCol?.field_name, cx: "50%", cy: "50%", outerRadius: 100, label: true, children: data.map((_, i) => (_jsx(Cell, { fill: COLORS[i % COLORS.length] }, i))) }), _jsx(Tooltip, {}), _jsx(Legend, {})] }) }) }));
    }
    if (chartType === "line") {
        return (_jsx("div", { className: "mb-6 rounded-lg border border-gray-200 bg-white p-4", children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: data, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: labelCol?.field_name, tick: { fontSize: 12 } }), _jsx(YAxis, { tick: { fontSize: 12 } }), _jsx(Tooltip, {}), _jsx(Legend, {}), numericCols.map((col, i) => (_jsx(Line, { type: "monotone", dataKey: col.field_name, name: col.label, stroke: COLORS[i % COLORS.length], strokeWidth: 2 }, col.field_name)))] }) }) }));
    }
    // Default: bar chart
    return (_jsx("div", { className: "mb-6 rounded-lg border border-gray-200 bg-white p-4", children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: data, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: labelCol?.field_name, tick: { fontSize: 12 } }), _jsx(YAxis, { tick: { fontSize: 12 } }), _jsx(Tooltip, {}), _jsx(Legend, {}), numericCols.map((col, i) => (_jsx(Bar, { dataKey: col.field_name, name: col.label, fill: COLORS[i % COLORS.length] }, col.field_name)))] }) }) }));
}
