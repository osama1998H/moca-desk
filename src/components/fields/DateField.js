import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FieldWrapper } from "./FieldWrapper";
export function DateField({ fieldDef, value, onChange, readOnly, error, className, }) {
    const [open, setOpen] = useState(false);
    const dateValue = value ? parseISO(value) : undefined;
    return (_jsx(FieldWrapper, { fieldDef: fieldDef, error: error, className: className, children: _jsxs(Popover, { open: open, onOpenChange: setOpen, children: [_jsx(PopoverTrigger, { asChild: true, children: _jsxs(Button, { id: fieldDef.name, variant: "outline", disabled: readOnly, "aria-invalid": !!error, className: cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground"), children: [_jsx(CalendarIcon, { "data-icon": "inline-start" }), dateValue ? format(dateValue, "PPP") : "Pick a date"] }) }), _jsx(PopoverContent, { className: "w-auto p-0", align: "start", children: _jsx(Calendar, { mode: "single", selected: dateValue, onSelect: (day) => {
                            onChange(day ? format(day, "yyyy-MM-dd") : "");
                            setOpen(false);
                        }, defaultMonth: dateValue }) })] }) }));
}
export default DateField;
