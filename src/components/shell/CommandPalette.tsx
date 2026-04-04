import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useDocList } from "@/providers/DocProvider";
import { SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DoctypeItem {
  name: string;
  label?: string;
  module?: string;
}

export function CommandPalette() {
  const navigate = useNavigate();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Fetch doctypes (same query as Sidebar)
  const { data: listData } = useDocList("DocType", {
    fields: ["name", "module", "label"],
    limit: 200,
  });

  const items: DoctypeItem[] = (listData?.data ?? []).map((d) => ({
    name: String(d.name ?? ""),
    label: d.label ? String(d.label) : undefined,
    module: d.module ? String(d.module) : undefined,
  }));

  // Filter by query
  const filtered = query
    ? items.filter((item) => {
        const q = query.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          (item.label?.toLowerCase().includes(q) ?? false)
        );
      })
    : items;

  // Open / close
  const open = useCallback(() => {
    setIsOpen(true);
    setQuery("");
    setSelectedIndex(0);
    dialogRef.current?.showModal();
    // Focus after dialog opens
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    dialogRef.current?.close();
  }, []);

  // Navigate to selected item
  const selectItem = useCallback(
    (item: DoctypeItem) => {
      close();
      navigate(`/desk/app/${encodeURIComponent(item.name)}`);
    },
    [close, navigate],
  );

  // Global keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          close();
        } else {
          open();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, open, close]);

  // Keyboard navigation within the palette
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((i) => Math.max(i - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (filtered[selectedIndex]) {
            selectItem(filtered[selectedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          close();
          break;
      }
    },
    [filtered, selectedIndex, selectItem, close],
  );

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  return (
    <dialog
      ref={dialogRef}
      onClose={() => setIsOpen(false)}
      className="fixed inset-0 m-0 h-full w-full max-w-none border-0 bg-transparent p-0 backdrop:bg-black/40"
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        className="flex h-full items-start justify-center pt-[15vh]"
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <div className="w-full max-w-lg overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
          {/* Search input */}
          <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3">
            <SearchIcon className="size-4 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search doctypes..."
              className="flex-1 text-sm outline-none placeholder:text-gray-400"
            />
            <kbd className="rounded border border-gray-200 px-1.5 py-0.5 text-[10px] text-gray-400">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-72 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                No results found
              </div>
            ) : (
              filtered.slice(0, 20).map((item, i) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => selectItem(item)}
                  onMouseEnter={() => setSelectedIndex(i)}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-2 text-left text-sm",
                    i === selectedIndex
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50",
                  )}
                >
                  <span className="font-medium">
                    {item.label || item.name}
                  </span>
                  {item.module && (
                    <span className="ml-auto text-xs text-gray-400">
                      {item.module}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>

          {/* Footer hint */}
          <div className="flex items-center gap-4 border-t border-gray-200 px-4 py-2 text-[10px] text-gray-400">
            <span>
              <kbd className="rounded border border-gray-200 px-1">
                &uarr;&darr;
              </kbd>{" "}
              Navigate
            </span>
            <span>
              <kbd className="rounded border border-gray-200 px-1">
                &crarr;
              </kbd>{" "}
              Open
            </span>
            <span>
              <kbd className="rounded border border-gray-200 px-1">
                esc
              </kbd>{" "}
              Close
            </span>
          </div>
        </div>
      </div>
    </dialog>
  );
}
