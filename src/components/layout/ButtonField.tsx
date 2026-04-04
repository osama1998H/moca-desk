import { Button } from "@/components/ui/button";
import type { LayoutFieldProps } from "@/components/fields/types";

export function ButtonField({ fieldDef, className }: LayoutFieldProps) {
  return (
    <div className={className}>
      <Button variant="outline" type="button">
        {fieldDef.label ?? "Action"}
      </Button>
    </div>
  );
}

export default ButtonField;
