import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
export function HTMLDisplay({ fieldDef, className }) {
    const content = fieldDef.options ?? "";
    return (_jsx("div", { className: cn("prose prose-sm dark:prose-invert", className), dangerouslySetInnerHTML: { __html: content } }));
}
export default HTMLDisplay;
