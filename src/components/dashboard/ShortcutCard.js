import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router";
import { ArrowRightIcon } from "lucide-react";
export function ShortcutCard({ config }) {
    const label = config.label ?? "Shortcut";
    const color = config.color ?? "#6b7280";
    const url = config.url ??
        (config.doctype ? `/desk/app/${config.doctype}` : "#");
    return (_jsxs(Link, { to: url, className: "group flex items-center justify-between rounded-lg border border-gray-200 bg-white p-5 transition-colors hover:border-gray-300", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "size-2.5 rounded-full", style: { backgroundColor: color } }), _jsx("span", { className: "text-sm font-medium text-gray-700 group-hover:text-gray-900", children: label })] }), _jsx(ArrowRightIcon, { className: "size-4 text-gray-400 group-hover:text-gray-600" })] }));
}
