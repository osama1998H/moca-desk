import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FieldWrapper } from "./FieldWrapper";
export function DatetimeField({ fieldDef, value, onChange, readOnly, error, className, }) {
    const [open, setOpen] = useState(false);
    const dateValue = value ? parseISO(value) : undefined;
    const timeStr = dateValue ? format(dateValue, "HH:mm") : "00:00";
    function handleDateSelect(day) {
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
    function handleTimeChange(e) {
        const parts = e.target.value.split(":").map(Number);
        const hours = parts[0] ?? 0;
        const minutes = parts[1] ?? 0;
        const d = dateValue ? new Date(dateValue) : new Date();
        d.setHours(hours, minutes, 0, 0);
        onChange(d.toISOString());
    }
    return (_jsx(FieldWrapper, { fieldDef: fieldDef, error: error, className: className, children: _jsxs(Popover, { open: open, onOpenChange: setOpen, children: [_jsx(PopoverTrigger, { asChild: true, children: _jsxs(Button, { id: fieldDef.name, variant: "outline", disabled: readOnly, "aria-invalid": !!error, className: cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground"), children: [_jsx(CalendarIcon, { "data-icon": "inline-start" }), dateValue
                                ? format(dateValue, "PPP HH:mm")
                                : "Pick date & time"] }) }), _jsxs(PopoverContent, { className: "w-auto p-0", align: "start", children: [_jsx(Calendar, { mode: "single", selected: dateValue, onSelect: handleDateSelect, defaultMonth: dateValue }), _jsx("div", { className: "border-t p-3", children: _jsx(Input, { type: "time", value: timeStr, onChange: handleTimeChange, disabled: readOnly }) })] })] }) }));
}
export default DatetimeField;
