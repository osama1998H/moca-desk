import { jsx as _jsx } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
export function ButtonField({ fieldDef, className }) {
    return (_jsx("div", { className: className, children: _jsx(Button, { variant: "outline", type: "button", children: fieldDef.label ?? "Action" }) }));
}
export default ButtonField;
