import type { LayoutFieldProps } from "@/components/fields/types";

export function TabBreak({ fieldDef, children }: LayoutFieldProps) {
  // TabBreak is a marker — the form layout engine collects consecutive TabBreaks
  // and builds a Tabs component. This component renders a label indicator for
  // standalone use and passes through children.
  const label = fieldDef.layout_label || fieldDef.label;

  return (
    <div data-field-type="TabBreak" data-tab-label={label ?? ""}>
      {children}
    </div>
  );
}

export default TabBreak;
