import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";

import { get } from "@/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ApiResponse, DocTypeListItem } from "@/api/types";

interface DocTypeListProps {
  onOpen: (name: string) => void;
  onBack: () => void;
}

export function DocTypeList({ onOpen, onBack }: DocTypeListProps) {
  const [items, setItems] = useState<DocTypeListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    get<ApiResponse<DocTypeListItem[]>>("dev/doctype")
      .then((res) => {
        if (!cancelled) setItems(res.data);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!items) return [];
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (it) =>
        it.name.toLowerCase().includes(q) ||
        it.module.toLowerCase().includes(q) ||
        it.app.toLowerCase().includes(q),
    );
  }, [items, query]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Back"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-base font-medium">Open Existing DocType</h3>
      </div>

      <div className="relative">
        <Search className="absolute start-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          autoFocus
          placeholder="Search doctypes…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="ps-8"
        />
      </div>

      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
          Couldn&apos;t load doctypes: {error}
        </div>
      )}

      {items === null && !error && (
        <div className="py-8 text-center text-sm text-muted-foreground">
          Loading…
        </div>
      )}

      {items !== null && items.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            No DocTypes yet. Create your first one.
          </p>
        </div>
      )}

      {items !== null && items.length > 0 && filtered.length === 0 && (
        <div className="py-8 text-center text-sm text-muted-foreground">
          No doctypes match &quot;{query}&quot;
        </div>
      )}

      {filtered.length > 0 && (
        <ul className="max-h-80 divide-y overflow-y-auto rounded-md border">
          {filtered.map((it) => (
            <li key={`${it.app}.${it.module}.${it.name}`}>
              <button
                type="button"
                onClick={() => onOpen(it.name)}
                className="flex w-full cursor-pointer items-center justify-between px-3 py-2 hover:bg-accent"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{it.name}</span>
                  {it.is_submittable && (
                    <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                      Submittable
                    </span>
                  )}
                  {it.is_single && (
                    <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                      Single
                    </span>
                  )}
                  {it.is_child_table && (
                    <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                      Child Table
                    </span>
                  )}
                  {it.is_virtual && (
                    <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                      Virtual
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {it.module} · {it.app}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
