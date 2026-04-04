import type { LayoutFieldProps } from "@/components/fields/types";

export function ColumnBreak({ children }: LayoutFieldProps) {
  // ColumnBreak is a marker — the form layout engine reads field_type to split
  // columns. It renders its children (if any) but produces no visible output
  // on its own.
  return children ? <>{children}</> : null;
}

export default ColumnBreak;
