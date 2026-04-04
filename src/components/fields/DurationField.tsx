import { Input } from "@/components/ui/input";
import { FieldWrapper } from "./FieldWrapper";
import type { FieldProps } from "./types";

function secondsToHMS(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function hmsToSeconds(hms: string): number {
  const parts = hms.split(":").map(Number);
  const h = parts[0] ?? 0;
  const m = parts[1] ?? 0;
  const s = parts[2] ?? 0;
  return h * 3600 + m * 60 + s;
}

export function DurationField({
  fieldDef,
  value,
  onChange,
  readOnly,
  error,
  className,
}: FieldProps<number | string>) {
  const display =
    typeof value === "number" ? secondsToHMS(value) : (value as string) ?? "";

  return (
    <FieldWrapper fieldDef={fieldDef} error={error} className={className}>
      <Input
        id={fieldDef.name}
        value={display}
        onChange={(e) => {
          const raw = e.target.value;
          if (/^\d{0,2}:\d{0,2}(:\d{0,2})?$/.test(raw) || raw === "") {
            onChange(raw === "" ? 0 : hmsToSeconds(raw));
          }
        }}
        readOnly={readOnly}
        disabled={readOnly}
        placeholder="HH:MM:SS"
        aria-invalid={!!error}
      />
    </FieldWrapper>
  );
}

export default DurationField;
