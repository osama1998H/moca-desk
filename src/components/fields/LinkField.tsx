import { useState, useRef, useEffect } from "react";
import { ExternalLinkIcon, XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { FieldWrapper } from "./FieldWrapper";
import { useLinkSearch } from "./hooks/useLinkSearch";
import type { FieldProps } from "./types";

export function LinkField({
  fieldDef,
  value,
  onChange,
  readOnly,
  error,
  className,
}: FieldProps<string>) {
  const targetDoctype = fieldDef.options ?? "";
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { results, isLoading } = useLinkSearch(targetDoctype, search, open);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  if (readOnly) {
    return (
      <FieldWrapper fieldDef={fieldDef} error={error} className={className}>
        <div className="flex h-8 items-center gap-1.5 rounded-lg border border-input bg-transparent px-2.5 text-sm">
          <span className="truncate">{(value as string) || "—"}</span>
          {value && (
            <a
              href={`/desk/app/${targetDoctype}/${encodeURIComponent(value as string)}`}
              className="ms-auto shrink-0 text-muted-foreground hover:text-foreground"
            >
              <ExternalLinkIcon className="size-3.5" />
            </a>
          )}
        </div>
      </FieldWrapper>
    );
  }

  return (
    <FieldWrapper fieldDef={fieldDef} error={error} className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={fieldDef.name}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-invalid={!!error}
            className={cn(
              "w-full justify-between font-normal",
              !value && "text-muted-foreground",
            )}
          >
            <span className="truncate">
              {(value as string) || `Search ${targetDoctype}...`}
            </span>
            {value ? (
              <XIcon
                className="size-3.5 shrink-0 opacity-50 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange("");
                }}
              />
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <div className="flex flex-col">
            <Input
              ref={inputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${targetDoctype}...`}
              className="rounded-none border-x-0 border-t-0 focus-visible:ring-0"
            />
            <div className="max-h-60 overflow-y-auto">
              {isLoading && (
                <div className="p-3 text-center text-sm text-muted-foreground">
                  Searching...
                </div>
              )}
              {!isLoading && results.length === 0 && (
                <div className="p-3 text-center text-sm text-muted-foreground">
                  No results found.
                </div>
              )}
              {results.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={cn(
                    "flex w-full items-center px-2.5 py-1.5 text-start text-sm hover:bg-accent",
                    item.value === value && "bg-accent",
                  )}
                  onClick={() => {
                    onChange(item.value);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </FieldWrapper>
  );
}

export default LinkField;
