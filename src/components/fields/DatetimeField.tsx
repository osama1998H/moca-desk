import { useState } from "react";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FieldWrapper } from "./FieldWrapper";
import type { FieldProps } from "./types";

export function DatetimeField({
  fieldDef,
  value,
  onChange,
  readOnly,
  error,
  className,
}: FieldProps<string>) {
  const [open, setOpen] = useState(false);
  const dateValue = value ? parseISO(value as string) : undefined;
  const timeStr = dateValue ? format(dateValue, "HH:mm") : "00:00";

  function handleDateSelect(day: Date | undefined) {
    if (!day) {
      onChange("");
      setOpen(false);
      return;
    }
    const parts = timeStr.split(":").map(Number);
    const hours = parts[0] ?? 0;
    const minutes = parts[1] ?? 0;
    day.setHours(hours, minutes, 0, 0);
    onChange(day.toISOString());
    setOpen(false);
  }

  function handleTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const parts = e.target.value.split(":").map(Number);
    const hours = parts[0] ?? 0;
    const minutes = parts[1] ?? 0;
    const d = dateValue ? new Date(dateValue) : new Date();
    d.setHours(hours, minutes, 0, 0);
    onChange(d.toISOString());
  }

  return (
    <FieldWrapper fieldDef={fieldDef} error={error} className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={fieldDef.name}
            variant="outline"
            disabled={readOnly}
            aria-invalid={!!error}
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground",
            )}
          >
            <CalendarIcon data-icon="inline-start" />
            {dateValue
              ? format(dateValue, "PPP HH:mm")
              : "Pick date & time"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dateValue}
            onSelect={handleDateSelect}
            defaultMonth={dateValue}
          />
          <div className="border-t p-3">
            <Input
              type="time"
              value={timeStr}
              onChange={handleTimeChange}
              disabled={readOnly}
            />
          </div>
        </PopoverContent>
      </Popover>
    </FieldWrapper>
  );
}

export default DatetimeField;
