import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useDocVersions } from "@/hooks/useDocVersions";
import { FieldDiff } from "@/components/version/FieldDiff";
import { cn } from "@/lib/utils";
import { XIcon, ChevronDownIcon, Loader2Icon } from "lucide-react";
export function VersionHistory({ doctype, name, fields, open, onClose, }) {
    // Build field name → label map for display.
    const fieldLabels = useMemo(() => {
        const map = new Map();
        for (const f of fields) {
            map.set(f.name, f.label || f.name);
        }
        return map;
    }, [fields]);
    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useDocVersions(doctype, name, { enabled: open });
    const versions = data?.pages.flatMap((p) => p.data) ?? [];
    return (_jsxs(_Fragment, { children: [open && (_jsx("div", { className: "fixed inset-0 z-40 bg-black/20", onClick: onClose })), _jsxs("div", { className: cn("fixed right-0 top-0 z-50 flex h-full w-96 flex-col border-l border-gray-200 bg-white shadow-lg transition-transform duration-200", open ? "translate-x-0" : "translate-x-full"), children: [_jsxs("div", { className: "flex items-center justify-between border-b border-gray-200 px-4 py-3", children: [_jsx("h2", { className: "text-sm font-semibold text-gray-900", children: "Version History" }), _jsx("button", { type: "button", onClick: onClose, className: "rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600", children: _jsx(XIcon, { className: "size-4" }) })] }), _jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-3", children: [isLoading ? (_jsx("div", { className: "flex items-center justify-center py-8 text-gray-400", children: _jsx(Loader2Icon, { className: "size-5 animate-spin" }) })) : versions.length === 0 ? (_jsx("p", { className: "py-8 text-center text-sm text-gray-500", children: "No versions recorded yet." })) : (_jsx("div", { className: "space-y-1", children: versions.map((v) => (_jsx(VersionEntry, { version: v, fieldLabels: fieldLabels }, v.name))) })), hasNextPage && (_jsx("div", { className: "mt-3 text-center", children: _jsxs("button", { type: "button", onClick: () => void fetchNextPage(), disabled: isFetchingNextPage, className: "inline-flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-50", children: [isFetchingNextPage && (_jsx(Loader2Icon, { className: "size-3 animate-spin" })), "Load more"] }) }))] })] })] }));
}
// ── Single version entry ───────────────────────────────────────────────────
function VersionEntry({ version, fieldLabels, }) {
    const [expanded, setExpanded] = useState(false);
    const changed = version.data.changed;
    const changedCount = changed ? Object.keys(changed).length : 0;
    const isInitial = changed === null;
    let relativeTime;
    try {
        relativeTime = formatDistanceToNow(new Date(version.creation), {
            addSuffix: true,
        });
    }
    catch {
        relativeTime = version.creation;
    }
    return (_jsxs("div", { className: "rounded-md border border-gray-100 bg-gray-50/50", children: [_jsxs("button", { type: "button", onClick: () => setExpanded((e) => !e), className: "flex w-full items-center gap-2 px-3 py-2.5 text-left", children: [_jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("div", { className: "text-xs font-medium text-gray-900", children: version.owner }), _jsx("div", { className: "text-xs text-gray-500", children: relativeTime }), _jsx("div", { className: "mt-0.5 text-xs text-gray-500", children: isInitial
                                    ? "Initial version"
                                    : `Changed ${String(changedCount)} field${changedCount !== 1 ? "s" : ""}` })] }), !isInitial && changedCount > 0 && (_jsx(ChevronDownIcon, { className: cn("size-3.5 shrink-0 text-gray-400 transition-transform", expanded && "rotate-180") }))] }), expanded && changed && (_jsx("div", { className: "space-y-2 border-t border-gray-100 px-3 py-2.5", children: Object.entries(changed).map(([field, diff]) => (_jsx(FieldDiff, { label: fieldLabels.get(field) ?? field, oldValue: diff.old, newValue: diff.new }, field))) }))] }));
}
