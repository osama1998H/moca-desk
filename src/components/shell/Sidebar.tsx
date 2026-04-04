import { useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { useDocList } from "@/providers/DocProvider";
import { cn } from "@/lib/utils";
import {
  ChevronRightIcon,
  SearchIcon,
  FileTextIcon,
} from "lucide-react";

interface DoctypeEntry {
  name: string;
  label?: string;
  module?: string;
}

export function Sidebar() {
  const { doctype: activeDoctype } = useParams<{ doctype: string }>();
  const [search, setSearch] = useState("");
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    () => new Set(),
  );

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

  // Auto-expand the module containing the active doctype
  const expandedWithActive = useMemo(() => {
    if (!activeDoctype) return expandedModules;
    for (const [mod, entries] of grouped) {
      if (entries.some((e) => e.name === activeDoctype)) {
        if (!expandedModules.has(mod)) {
          return new Set([...expandedModules, mod]);
        }
      }
    }
    return expandedModules;
  }, [activeDoctype, grouped, expandedModules]);

  const toggleModule = (mod: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(mod)) next.delete(mod);
      else next.add(mod);
      return next;
    });
  };

  return (
    <aside className="flex w-64 flex-col border-r border-gray-200 bg-white">
      {/* Brand */}
      <div className="flex h-14 items-center border-b border-gray-200 px-4">
        <Link
          to="/desk/app"
          className="text-lg font-semibold text-gray-900"
        >
          Moca
        </Link>
      </div>

      {/* Search */}
      <div className="border-b border-gray-200 px-3 py-2">
        <div className="relative">
          <SearchIcon className="absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full rounded-md border border-gray-200 py-1.5 pl-7 pr-2 text-sm placeholder:text-gray-400 focus:border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-300"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-2">
        {/* Home link */}
        <Link
          to="/desk/app"
          className={cn(
            "mb-1 flex items-center gap-2 rounded-md px-3 py-1.5 text-sm",
            !activeDoctype
              ? "bg-blue-50 text-blue-700"
              : "text-gray-700 hover:bg-gray-100",
          )}
        >
          Home
        </Link>

        {/* Module groups */}
        {grouped.map(([mod, entries]) => {
          const isExpanded = expandedWithActive.has(mod);
          return (
            <div key={mod} className="mt-1">
              <button
                type="button"
                onClick={() => toggleModule(mod)}
                className="flex w-full items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-gray-400 hover:text-gray-600"
              >
                <ChevronRightIcon
                  className={cn(
                    "size-3 transition-transform",
                    isExpanded && "rotate-90",
                  )}
                />
                {mod}
                <span className="ml-auto text-[10px] text-gray-300">
                  {entries.length}
                </span>
              </button>
              {isExpanded && (
                <div className="ml-2">
                  {entries.map((entry) => (
                    <Link
                      key={entry.name}
                      to={`/desk/app/${encodeURIComponent(entry.name)}`}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm",
                        activeDoctype === entry.name
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-600 hover:bg-gray-100",
                      )}
                    >
                      <FileTextIcon className="size-3.5 flex-shrink-0 text-gray-400" />
                      <span className="truncate">
                        {entry.label || entry.name}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
