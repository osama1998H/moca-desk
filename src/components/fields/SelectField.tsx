import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldWrapper } from "./FieldWrapper";
import type { FieldProps } from "./types";

function parseOptions(options?: string): string[] {
  if (!options) return [];
  return options
    .split("\n")
    .map((o) => o.trim())
    .filter(Boolean);
}

export function SelectField({
  fieldDef,
  value,
  onChange,
  readOnly,
  error,
  className,
}: FieldProps<string>) {
  const options = parseOptions(fieldDef.options);

  return (
    <FieldWrapper fieldDef={fieldDef} error={error} className={className}>
      <Select
        value={(value as string) ?? ""}
        onValueChange={onChange}
        disabled={readOnly}
      >
        <SelectTrigger
          id={fieldDef.name}
          className="w-full"
          aria-invalid={!!error}
        >
          <SelectValue placeholder={`Select ${fieldDef.label ?? ""}...`} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </FieldWrapper>
  );
}

export default SelectField;
