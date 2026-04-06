import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { RefreshCwIcon } from "lucide-react";
export function StaleDocBanner({ user, onReload }) {
    return (_jsxs("div", { className: "mb-4 flex items-center justify-between rounded-md border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800", children: [_jsxs("span", { children: ["This document was modified by ", _jsx("strong", { children: user }), ". Reload to see changes."] }), _jsxs("button", { type: "button", onClick: onReload, className: "inline-flex items-center gap-1.5 rounded-md border border-amber-300 bg-white px-2.5 py-1 text-xs font-medium text-amber-800 hover:bg-amber-50", children: [_jsx(RefreshCwIcon, { className: "size-3" }), "Reload"] })] }));
}
