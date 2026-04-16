import { useState } from "react";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FieldWrapper } from "./FieldWrapper";
import type { FieldProps } from "./types";

export function DateField({
  fieldDef,
  value,
  onChange,
  readOnly,
  error,
  className,
}: FieldProps<string>) {
  const [open, setOpen] = useState(false);
  const dateValue = value ? parseISO(value as string) : undefined;

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
              "w-full justify-start text-start font-normal",
              !value && "text-muted-foreground",
            )}
          >
            <CalendarIcon data-icon="inline-start" />
            {dateValue ? format(dateValue, "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dateValue}
            onSelect={(day) => {
              onChange(day ? format(day, "yyyy-MM-dd") : "");
              setOpen(false);
            }}
            defaultMonth={dateValue}
          />
        </PopoverContent>
      </Popover>
    </FieldWrapper>
  );
}

export default DateField;
