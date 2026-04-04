import { useCallback, createContext, useContext } from "react";
import { PlusIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMetaType } from "@/providers/MetaProvider";
import { FieldWrapper } from "./FieldWrapper";
import { FieldRenderer } from "./FieldRenderer";
import type { FieldProps } from "./types";
import type { DocRecord, FieldDef } from "@/api/types";

// Context to prevent nested TableField rendering
const TableContext = createContext(false);

function useIsInsideTable() {
  return useContext(TableContext);
}

function getVisibleFields(fields: FieldDef[]): FieldDef[] {
  return fields.filter(
    (f) =>
      f.in_api !== false &&
      !f.hidden &&
      f.field_type !== "SectionBreak" &&
      f.field_type !== "ColumnBreak" &&
      f.field_type !== "TabBreak" &&
      f.field_type !== "Table", // prevent recursion
  );
}

export function TableField({
  fieldDef,
  value,
  onChange,
  readOnly,
  error,
  className,
}: FieldProps<DocRecord[]>) {
  const isNested = useIsInsideTable();
  const childDoctype = fieldDef.options ?? "";
  const { data: childMeta, isLoading } = useMetaType(childDoctype);

  const rows = (value as DocRecord[]) ?? [];

  const addRow = useCallback(() => {
    const newRow: DocRecord = { __idx: Date.now() };
    onChange([...rows, newRow]);
  }, [rows, onChange]);

  const removeRow = useCallback(
    (index: number) => {
      onChange(rows.filter((_, i) => i !== index));
    },
    [rows, onChange],
  );

  const updateRow = useCallback(
    (index: number, fieldName: string, fieldValue: unknown) => {
      const updated = rows.map((row, i) =>
        i === index ? { ...row, [fieldName]: fieldValue } : row,
      );
      onChange(updated);
    },
    [rows, onChange],
  );

  // Guard: prevent infinitely nested tables
  if (isNested) {
    return (
      <FieldWrapper fieldDef={fieldDef} error={error} className={className}>
        <div className="rounded-lg border border-dashed p-3 text-center text-sm text-muted-foreground">
          Nested child tables are not supported
        </div>
      </FieldWrapper>
    );
  }

  if (isLoading || !childMeta) {
    return (
      <FieldWrapper fieldDef={fieldDef} error={error} className={className}>
        <div className="h-20 animate-pulse rounded-lg bg-muted" />
      </FieldWrapper>
    );
  }

  const visibleFields = getVisibleFields(childMeta.fields);

  return (
    <TableContext.Provider value={true}>
      <FieldWrapper fieldDef={fieldDef} error={error} className={className}>
        <div className="rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="w-10 px-2 py-1.5 text-center text-xs font-medium text-muted-foreground">
                    #
                  </th>
                  {visibleFields.map((f) => (
                    <th
                      key={f.name}
                      className="px-2 py-1.5 text-left text-xs font-medium text-muted-foreground"
                    >
                      {f.label}
                      {f.required && (
                        <span className="text-destructive">*</span>
                      )}
                    </th>
                  ))}
                  {!readOnly && (
                    <th className="w-10 px-2 py-1.5" />
                  )}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td
                      colSpan={visibleFields.length + (readOnly ? 1 : 2)}
                      className="px-2 py-6 text-center text-muted-foreground"
                    >
                      No rows. {!readOnly && "Click + to add."}
                    </td>
                  </tr>
                )}
                {rows.map((row, idx) => (
                  <tr
                    key={(row["__idx"] as number) ?? (row["name"] as string) ?? idx}
                    className={cn(
                      "border-b last:border-b-0",
                      "hover:bg-muted/30",
                    )}
                  >
                    <td className="px-2 py-1 text-center text-xs text-muted-foreground">
                      {idx + 1}
                    </td>
                    {visibleFields.map((f) => (
                      <td key={f.name} className="px-1 py-0.5">
                        <FieldRenderer
                          fieldDef={{ ...f, label: "", required: false }}
                          value={row[f.name]}
                          onChange={(v: unknown) => updateRow(idx, f.name, v)}
                          readOnly={readOnly}
                        />
                      </td>
                    ))}
                    {!readOnly && (
                      <td className="px-1 py-1 text-center">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => removeRow(idx)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <TrashIcon />
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!readOnly && (
            <div className="border-t p-1.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={addRow}
                className="w-full"
              >
                <PlusIcon data-icon="inline-start" />
                Add Row
              </Button>
            </div>
          )}
        </div>
      </FieldWrapper>
    </TableContext.Provider>
  );
}

export default TableField;
