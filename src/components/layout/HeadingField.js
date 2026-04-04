import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
export function HeadingField({ fieldDef, className }) {
    return (_jsx("h3", { className: cn("col-span-full text-base font-semibold", className), children: fieldDef.label ?? "" }));
}
export default HeadingField;
