import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
export function SectionBreak({ fieldDef, children, className, }) {
    const collapsible = fieldDef.collapsible ?? false;
    const [collapsed, setCollapsed] = useState(fieldDef.collapsed_by_default ?? false);
    const label = fieldDef.layout_label || fieldDef.label;
    return (_jsxs("div", { className: cn("col-span-full", className), children: [_jsx(Separator, { className: "mb-3" }), label && (_jsxs("button", { type: "button", className: cn("flex w-full items-center gap-1.5 text-sm font-medium text-muted-foreground", collapsible && "cursor-pointer hover:text-foreground", !collapsible && "cursor-default"), onClick: collapsible ? () => setCollapsed((c) => !c) : undefined, disabled: !collapsible, children: [collapsible && (_jsx(ChevronDownIcon, { className: cn("size-4 transition-transform", collapsed && "-rotate-90") })), label] })), (!collapsible || !collapsed) && children && (_jsx("div", { className: "mt-3", children: children }))] }));
}
export default SectionBreak;
