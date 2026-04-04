import { jsx as _jsx } from "react/jsx-runtime";
export function TabBreak({ fieldDef, children }) {
    // TabBreak is a marker — the form layout engine collects consecutive TabBreaks
    // and builds a Tabs component. This component renders a label indicator for
    // standalone use and passes through children.
    const label = fieldDef.layout_label || fieldDef.label;
    return (_jsx("div", { "data-field-type": "TabBreak", "data-tab-label": label ?? "", children: children }));
}
export default TabBreak;
