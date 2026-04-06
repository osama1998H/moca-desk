import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Loader2Icon, PlayIcon } from "lucide-react";
export function ReportFilters({ filters, values, onChange, onRun, isLoading, }) {
    const handleChange = (fieldName, value) => {
        onChange({ ...values, [fieldName]: value || undefined });
    };
    if (filters.length === 0)
        return null;
    return (_jsxs("div", { className: "mb-4 flex flex-wrap items-end gap-3", children: [filters.map((f) => (_jsxs("div", { className: "flex flex-col gap-1", children: [_jsxs("label", { className: "text-xs font-medium text-gray-500", children: [f.label, f.required && _jsx("span", { className: "text-red-500", children: "*" })] }), f.field_type === "Select" && typeof f.default === "string" ? (_jsxs("select", { value: String(values[f.field_name] ?? ""), onChange: (e) => handleChange(f.field_name, e.target.value), className: "rounded border border-gray-300 px-2 py-1.5 text-sm", children: [_jsx("option", { value: "", children: "All" }), f.default
                                .split("\n")
                                .filter(Boolean)
                                .map((opt) => (_jsx("option", { value: opt, children: opt }, opt)))] })) : f.field_type === "Check" ? (_jsxs("select", { value: String(values[f.field_name] ?? ""), onChange: (e) => handleChange(f.field_name, e.target.value), className: "rounded border border-gray-300 px-2 py-1.5 text-sm", children: [_jsx("option", { value: "", children: "All" }), _jsx("option", { value: "1", children: "Yes" }), _jsx("option", { value: "0", children: "No" })] })) : f.field_type === "Date" ? (_jsx("input", { type: "date", value: String(values[f.field_name] ?? ""), onChange: (e) => handleChange(f.field_name, e.target.value), className: "rounded border border-gray-300 px-2 py-1.5 text-sm" })) : (_jsx("input", { type: "text", value: String(values[f.field_name] ?? ""), onChange: (e) => handleChange(f.field_name, e.target.value), placeholder: f.label, className: "w-36 rounded border border-gray-300 px-2 py-1.5 text-sm" }))] }, f.field_name))), _jsxs("button", { type: "button", onClick: onRun, disabled: isLoading, className: "inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 disabled:opacity-50", children: [isLoading ? (_jsx(Loader2Icon, { className: "size-3.5 animate-spin" })) : (_jsx(PlayIcon, { className: "size-3.5" })), "Run Report"] })] }));
}
