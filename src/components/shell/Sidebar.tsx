import { useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { useDocList } from "@/providers/DocProvider";
import { useI18n } from "@/providers/I18nProvider";
import { BlocksIcon, ChevronRightIcon, HomeIcon, SearchIcon, FileTextIcon } from "lucide-react";
import { getCustomSidebarItems } from "@/lib/sidebarRegistry";
import { getIconComponent } from "@/lib/iconMap";
import {
  Sidebar as SidebarRoot,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface DoctypeEntry {
  name: string;
  label?: string;
  module?: string;
}

export default function Sidebar() {
  const { doctype: activeDoctype } = useParams<{ doctype: string }>();
  const [search, setSearch] = useState("");
  const { t } = useI18n();

  // Fetch available doctypes
  const { data: listData } = useDocList("DocType", {
    fields: ["name", "module", "label"],
    limit: 200,
  });

  // Group by module
  const grouped = useMemo(() => {
    const entries: DoctypeEntry[] = (listData?.data ?? []).map((d) => ({
      name: String(d.name ?? ""),
      label: d.label ? String(d.label) : undefined,
      module: d.module ? String(d.module) : "Other",
    }));

    // Filter by search
    const query = search.toLowerCase();
    const filtered = query
      ? entries.filter(
          (e) =>
            e.name.toLowerCase().includes(query) ||
            (e.label?.toLowerCase().includes(query) ?? false),
        )
      : entries;

    // Group
    const map = new Map<string, DoctypeEntry[]>();
    for (const e of filtered) {
      const mod = e.module ?? "Other";
      if (!map.has(mod)) map.set(mod, []);
      map.get(mod)!.push(e);
    }

    // Sort modules alphabetically, with "Core" first
    return [...map.entries()].sort(([a], [b]) => {
      if (a === "Core") return -1;
      if (b === "Core") return 1;
      return a.localeCompare(b);
    });
  }, [listData, search]);

  const customItems = getCustomSidebarItems();

  return (
    <SidebarRoot>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/desk/app">
                <span className="font-semibold">Moca</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <form onSubmit={(e) => e.preventDefault()}>
          <SidebarGroup className="py-0">
            <SidebarGroupContent className="relative">
              <Label htmlFor="search" className="sr-only">
                Search
              </Label>
              <SidebarInput
                id="search"
                placeholder={t("Search...")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
              <SearchIcon className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50" />
            </SidebarGroupContent>
          </SidebarGroup>
        </form>
      </SidebarHeader>

      <SidebarContent>
        {/* Home link + top-level nav */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={!activeDoctype}>
                <Link to="/desk/app">
                  <HomeIcon data-icon />
                  <span>{t("Home")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/desk/app/doctype-builder">
                  <BlocksIcon data-icon />
                  <span>{t("DocType Builder")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Module groups */}
        {grouped.map(([mod, entries]) => {
          const containsActive = entries.some(
            (e) => e.name === activeDoctype,
          );

          return (
            <Collapsible
              key={mod}
              defaultOpen={containsActive}
              className="group/collapsible"
            >
              <SidebarGroup>
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger className="flex w-full items-center justify-between">
                    {mod}
                    <span className="flex items-center gap-1">
                      <Badge variant="secondary">{entries.length}</Badge>
                      <ChevronRightIcon
                        data-icon
                        className="size-4 transition-transform group-data-[state=open]/collapsible:rotate-90"
                      />
                    </span>
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {entries.map((entry) => (
                        <SidebarMenuItem key={entry.name}>
                          <SidebarMenuButton
                            asChild
                            isActive={activeDoctype === entry.name}
                          >
                            <Link
                              to={`/desk/app/${encodeURIComponent(entry.name)}`}
                            >
                              <FileTextIcon data-icon />
                              <span>{entry.label || entry.name}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          );
        })}

        {/* Custom sidebar items from registry */}
        {customItems.length > 0 && (
          <>
            {customItems.map((item) => {
              const Icon = getIconComponent(item.icon);

              if (item.children) {
                return (
                  <Collapsible
                    key={item.label}
                    defaultOpen={false}
                    className="group/collapsible"
                  >
                    <SidebarGroup>
                      <SidebarGroupLabel asChild>
                        <CollapsibleTrigger className="flex w-full items-center justify-between">
                          {item.label}
                          <span className="flex items-center gap-1">
                            <Badge variant="secondary">
                              {item.children.length}
                            </Badge>
                            <ChevronRightIcon
                              data-icon
                              className="size-4 transition-transform group-data-[state=open]/collapsible:rotate-90"
                            />
                          </span>
                        </CollapsibleTrigger>
                      </SidebarGroupLabel>
                      <CollapsibleContent>
                        <SidebarGroupContent>
                          <SidebarMenu>
                            {item.children.map((child) => (
                              <SidebarMenuItem key={child.path}>
                                <SidebarMenuButton asChild>
                                  <Link to={child.path}>
                                    <Icon data-icon />
                                    <span>{child.label}</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            ))}
                          </SidebarMenu>
                        </SidebarGroupContent>
                      </CollapsibleContent>
                    </SidebarGroup>
                  </Collapsible>
                );
              }

              return (
                <SidebarGroup key={item.label}>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link to={item.path!}>
                          <Icon data-icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroup>
              );
            })}
          </>
        )}
      </SidebarContent>

      <SidebarRail />
    </SidebarRoot>
  );
}
