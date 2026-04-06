import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
function formatValue(value) {
    if (value === null || value === undefined)
        return "(empty)";
    if (typeof value === "object")
        return JSON.stringify(value, null, 2);
    return String(value);
}
export function FieldDiff({ label, oldValue, newValue }) {
    const isComplex = typeof oldValue === "object" || typeof newValue === "object";
    const Tag = isComplex ? "pre" : "span";
    return (_jsxs("div", { className: "space-y-1", children: [_jsx("span", { className: "text-xs font-medium text-gray-600", children: label }), _jsxs("div", { className: "flex flex-col gap-0.5 text-sm", children: [_jsx(Tag, { className: cn("rounded px-2 py-0.5 break-words", "bg-red-50 text-red-800", isComplex && "overflow-x-auto whitespace-pre-wrap text-xs"), children: formatValue(oldValue) }), _jsx(Tag, { className: cn("rounded px-2 py-0.5 break-words", "bg-green-50 text-green-800", isComplex && "overflow-x-auto whitespace-pre-wrap text-xs"), children: formatValue(newValue) })] })] }));
}
