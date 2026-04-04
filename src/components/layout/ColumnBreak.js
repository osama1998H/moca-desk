import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
export function ColumnBreak({ children }) {
    // ColumnBreak is a marker — the form layout engine reads field_type to split
    // columns. It renders its children (if any) but produces no visible output
    // on its own.
    return children ? _jsx(_Fragment, { children: children }) : null;
}
export default ColumnBreak;
