import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { ExternalLinkIcon, XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { FieldWrapper } from "./FieldWrapper";
import { useLinkSearch } from "./hooks/useLinkSearch";
export function LinkField({ fieldDef, value, onChange, readOnly, error, className, }) {
    const targetDoctype = fieldDef.options ?? "";
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const inputRef = useRef(null);
    const { results, isLoading } = useLinkSearch(targetDoctype, search, open);
    useEffect(() => {
        if (open && inputRef.current) {
            inputRef.current.focus();
        }
    }, [open]);
    if (readOnly) {
        return (_jsx(FieldWrapper, { fieldDef: fieldDef, error: error, className: className, children: _jsxs("div", { className: "flex h-8 items-center gap-1.5 rounded-lg border border-input bg-transparent px-2.5 text-sm", children: [_jsx("span", { className: "truncate", children: value || "—" }), value && (_jsx("a", { href: `/desk/app/${targetDoctype}/${encodeURIComponent(value)}`, className: "ml-auto shrink-0 text-muted-foreground hover:text-foreground", children: _jsx(ExternalLinkIcon, { className: "size-3.5" }) }))] }) }));
    }
    return (_jsx(FieldWrapper, { fieldDef: fieldDef, error: error, className: className, children: _jsxs(Popover, { open: open, onOpenChange: setOpen, children: [_jsx(PopoverTrigger, { asChild: true, children: _jsxs(Button, { id: fieldDef.name, variant: "outline", role: "combobox", "aria-expanded": open, "aria-invalid": !!error, className: cn("w-full justify-between font-normal", !value && "text-muted-foreground"), children: [_jsx("span", { className: "truncate", children: value || `Search ${targetDoctype}...` }), value ? (_jsx(XIcon, { className: "size-3.5 shrink-0 opacity-50 hover:opacity-100", onClick: (e) => {
                                    e.stopPropagation();
                                    onChange("");
                                } })) : null] }) }), _jsx(PopoverContent, { className: "w-[--radix-popover-trigger-width] p-0", align: "start", children: _jsxs("div", { className: "flex flex-col", children: [_jsx(Input, { ref: inputRef, value: search, onChange: (e) => setSearch(e.target.value), placeholder: `Search ${targetDoctype}...`, className: "rounded-none border-x-0 border-t-0 focus-visible:ring-0" }), _jsxs("div", { className: "max-h-60 overflow-y-auto", children: [isLoading && (_jsx("div", { className: "p-3 text-center text-sm text-muted-foreground", children: "Searching..." })), !isLoading && results.length === 0 && (_jsx("div", { className: "p-3 text-center text-sm text-muted-foreground", children: "No results found." })), results.map((item) => (_jsx("button", { type: "button", className: cn("flex w-full items-center px-2.5 py-1.5 text-left text-sm hover:bg-accent", item.value === value && "bg-accent"), onClick: () => {
                                            onChange(item.value);
                                            setOpen(false);
                                            setSearch("");
                                        }, children: item.label }, item.value)))] })] }) })] }) }));
}
export default LinkField;
