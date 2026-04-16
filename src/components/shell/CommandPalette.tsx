import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useDocList } from "@/providers/DocProvider";
import { useI18n } from "@/providers/I18nProvider";
import { BlocksIcon, HomeIcon } from "lucide-react";
import {
  CommandDialog,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";

interface DoctypeItem {
  name: string;
  label?: string;
  module?: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useI18n();

  // Fetch doctypes
  const { data: listData } = useDocList("DocType", {
    fields: ["name", "module", "label"],
    limit: 200,
  });

  const items: DoctypeItem[] = (listData?.data ?? []).map((d) => ({
    name: String(d.name ?? ""),
    label: d.label ? String(d.label) : undefined,
    module: d.module ? String(d.module) : undefined,
  }));

  // Cmd+K / Ctrl+K handler
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // Group doctypes by module
  const grouped = useMemo(() => {
    const groups: Record<string, DoctypeItem[]> = {};
    for (const item of items) {
      const mod = item.module || "Uncategorized";
      if (!groups[mod]) {
        groups[mod] = [];
      }
      groups[mod].push(item);
    }
    return groups;
  }, [items]);

  function handleSelect(doctype: string) {
    setOpen(false);
    void navigate(`/desk/app/${encodeURIComponent(doctype)}`);
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title={t("Search DocTypes")}
      description={t("Search and navigate to any DocType")}
    >
      <Command>
        <CommandInput placeholder={t("Search doctypes...")} />
        <CommandList>
          <CommandEmpty>{t("No doctypes found.")}</CommandEmpty>
          <CommandGroup heading={t("Navigation")}>
            <CommandItem
              onSelect={() => {
                setOpen(false);
                void navigate("/desk/app");
              }}
            >
              <HomeIcon data-icon="inline-start" />
              {t("Home")}
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setOpen(false);
                void navigate("/desk/app/doctype-builder");
              }}
            >
              <BlocksIcon data-icon="inline-start" />
              {t("New DocType")}
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          {Object.entries(grouped).map(([module, dts]) => (
            <CommandGroup key={module} heading={module}>
              {dts.map((dt) => (
                <CommandItem
                  key={dt.name}
                  value={`${dt.name} ${dt.label ?? ""}`}
                  onSelect={() => handleSelect(dt.name)}
                >
                  <span>{dt.label || dt.name}</span>
                  {dt.module && (
                    <Badge variant="secondary" className="ms-auto">
                      {dt.module}
                    </Badge>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
