import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams } from "react-router";
import { Loader2Icon } from "lucide-react";
import { useDashboardDef } from "@/providers/DashboardProvider";
import { NumberCard } from "@/components/dashboard/NumberCard";
import { ChartWidget } from "@/components/dashboard/ChartWidget";
import { ListWidget } from "@/components/dashboard/ListWidget";
import { ShortcutCard } from "@/components/dashboard/ShortcutCard";
export function DashboardView() {
    const { name = "" } = useParams();
    const { data: dash, isLoading, error } = useDashboardDef(name);
    if (isLoading) {
        return (_jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-500", children: [_jsx(Loader2Icon, { className: "size-4 animate-spin" }), "Loading dashboard..."] }));
    }
    if (error) {
        return (_jsx("div", { className: "rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700", children: error.message }));
    }
    if (!dash)
        return null;
    return (_jsxs("div", { children: [_jsx("h1", { className: "mb-6 text-xl font-semibold text-gray-900", children: dash.label || dash.name }), _jsx("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3", children: dash.widgets.map((widget, idx) => {
                    switch (widget.type) {
                        case "number_card":
                            return (_jsx(NumberCard, { dashboardName: name, widgetIdx: idx, config: widget.config }, idx));
                        case "chart":
                            return (_jsx("div", { className: "md:col-span-2", children: _jsx(ChartWidget, { dashboardName: name, widgetIdx: idx, config: widget.config }) }, idx));
                        case "list":
                            return (_jsx(ListWidget, { dashboardName: name, widgetIdx: idx, config: widget.config }, idx));
                        case "shortcut":
                            return _jsx(ShortcutCard, { config: widget.config }, idx);
                        default:
                            return null;
                    }
                }) })] }));
}
export default DashboardView;
