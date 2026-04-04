import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, createContext, useContext } from "react";
import { PlusIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMetaType } from "@/providers/MetaProvider";
import { FieldWrapper } from "./FieldWrapper";
import { FieldRenderer } from "./FieldRenderer";
// Context to prevent nested TableField rendering
const TableContext = createContext(false);
function useIsInsideTable() {
    return useContext(TableContext);
}
function getVisibleFields(fields) {
    return fields.filter((f) => f.in_api !== false &&
        !f.hidden &&
        f.field_type !== "SectionBreak" &&
        f.field_type !== "ColumnBreak" &&
        f.field_type !== "TabBreak" &&
        f.field_type !== "Table");
}
export function TableField({ fieldDef, value, onChange, readOnly, error, className, }) {
    const isNested = useIsInsideTable();
    const childDoctype = fieldDef.options ?? "";
    const { data: childMeta, isLoading } = useMetaType(childDoctype);
    const rows = value ?? [];
    const addRow = useCallback(() => {
        const newRow = { __idx: Date.now() };
        onChange([...rows, newRow]);
    }, [rows, onChange]);
    const removeRow = useCallback((index) => {
        onChange(rows.filter((_, i) => i !== index));
    }, [rows, onChange]);
    const updateRow = useCallback((index, fieldName, fieldValue) => {
        const updated = rows.map((row, i) => i === index ? { ...row, [fieldName]: fieldValue } : row);
        onChange(updated);
    }, [rows, onChange]);
    // Guard: prevent infinitely nested tables
    if (isNested) {
        return (_jsx(FieldWrapper, { fieldDef: fieldDef, error: error, className: className, children: _jsx("div", { className: "rounded-lg border border-dashed p-3 text-center text-sm text-muted-foreground", children: "Nested child tables are not supported" }) }));
    }
    if (isLoading || !childMeta) {
        return (_jsx(FieldWrapper, { fieldDef: fieldDef, error: error, className: className, children: _jsx("div", { className: "h-20 animate-pulse rounded-lg bg-muted" }) }));
    }
    const visibleFields = getVisibleFields(childMeta.fields);
    return (_jsx(TableContext.Provider, { value: true, children: _jsx(FieldWrapper, { fieldDef: fieldDef, error: error, className: className, children: _jsxs("div", { className: "rounded-lg border", children: [_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b bg-muted/50", children: [_jsx("th", { className: "w-10 px-2 py-1.5 text-center text-xs font-medium text-muted-foreground", children: "#" }), visibleFields.map((f) => (_jsxs("th", { className: "px-2 py-1.5 text-left text-xs font-medium text-muted-foreground", children: [f.label, f.required && (_jsx("span", { className: "text-destructive", children: "*" }))] }, f.name))), !readOnly && (_jsx("th", { className: "w-10 px-2 py-1.5" }))] }) }), _jsxs("tbody", { children: [rows.length === 0 && (_jsx("tr", { children: _jsxs("td", { colSpan: visibleFields.length + (readOnly ? 1 : 2), className: "px-2 py-6 text-center text-muted-foreground", children: ["No rows. ", !readOnly && "Click + to add."] }) })), rows.map((row, idx) => (_jsxs("tr", { className: cn("border-b last:border-b-0", "hover:bg-muted/30"), children: [_jsx("td", { className: "px-2 py-1 text-center text-xs text-muted-foreground", children: idx + 1 }), visibleFields.map((f) => (_jsx("td", { className: "px-1 py-0.5", children: _jsx(FieldRenderer, { fieldDef: { ...f, label: "", required: false }, value: row[f.name], onChange: (v) => updateRow(idx, f.name, v), readOnly: readOnly }) }, f.name))), !readOnly && (_jsx("td", { className: "px-1 py-1 text-center", children: _jsx(Button, { variant: "ghost", size: "icon-xs", onClick: () => removeRow(idx), className: "text-muted-foreground hover:text-destructive", children: _jsx(TrashIcon, {}) }) }))] }, row["__idx"] ?? row["name"] ?? idx)))] })] }) }), !readOnly && (_jsx("div", { className: "border-t p-1.5", children: _jsxs(Button, { variant: "ghost", size: "sm", onClick: addRow, className: "w-full", children: [_jsx(PlusIcon, { "data-icon": "inline-start" }), "Add Row"] }) }))] }) }) }));
}
export default TableField;
