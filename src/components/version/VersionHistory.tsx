import { useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useDocVersions } from "@/hooks/useDocVersions";
import { FieldDiff } from "@/components/version/FieldDiff";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, Loader2Icon } from "lucide-react";
import type { FieldDef } from "@/api/types";
import type { VersionRecord } from "@/api/ws-types";

interface VersionHistoryProps {
  doctype: string;
  name: string;
  fields: FieldDef[];
  open: boolean;
  onClose: () => void;
}

export function VersionHistory({
  doctype,
  name,
  fields,
  open,
  onClose,
}: VersionHistoryProps) {
  // Build field name → label map for display.
  const fieldLabels = useMemo(() => {
    const map = new Map<string, string>();
    for (const f of fields) {
      map.set(f.name, f.label || f.name);
    }
    return map;
  }, [fields]);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useDocVersions(doctype, name, { enabled: open });

  const versions = data?.pages.flatMap((p) => p.data) ?? [];

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-96 sm:max-w-96">
        <SheetHeader>
          <SheetTitle>Version History</SheetTitle>
          <SheetDescription className="sr-only">
            Document change history
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2Icon className="size-5 animate-spin" />
            </div>
          ) : versions.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No versions recorded yet.
            </p>
          ) : (
            <div className="space-y-1">
              {versions.map((v) => (
                <VersionEntry
                  key={v.name}
                  version={v}
                  fieldLabels={fieldLabels}
                />
              ))}
            </div>
          )}

          {/* Load more */}
          {hasNextPage && (
            <div className="mt-3 text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => void fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage && (
                  <Loader2Icon data-icon="inline-start" className="animate-spin" />
                )}
                Load more
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ── Single version entry ───────────────────────────────────────────────────

function VersionEntry({
  version,
  fieldLabels,
}: {
  version: VersionRecord;
  fieldLabels: Map<string, string>;
}) {
  const [expanded, setExpanded] = useState(false);
  const changed = version.data.changed;
  const changedCount = changed ? Object.keys(changed).length : 0;
  const isInitial = changed === null;

  let relativeTime: string;
  try {
    relativeTime = formatDistanceToNow(new Date(version.creation), {
      addSuffix: true,
    });
  } catch {
    relativeTime = version.creation;
  }

  return (
    <div className="rounded-md border border-border bg-muted/50">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-start"
      >
        <div className="min-w-0 flex-1">
          <div className="text-xs font-medium text-foreground">
            {version.owner}
          </div>
          <div className="text-xs text-muted-foreground">{relativeTime}</div>
          <div className="mt-0.5 text-xs text-muted-foreground">
            {isInitial
              ? "Initial version"
              : `Changed ${String(changedCount)} field${changedCount !== 1 ? "s" : ""}`}
          </div>
        </div>
        {!isInitial && changedCount > 0 && (
          <ChevronDownIcon
            className={cn(
              "size-3.5 shrink-0 text-muted-foreground transition-transform",
              expanded && "rotate-180",
            )}
          />
        )}
      </button>

      {/* Expanded diff */}
      {expanded && changed && (
        <div className="space-y-2 border-t border-border px-3 py-2.5">
          {Object.entries(changed).map(([field, diff]) => (
            <FieldDiff
              key={field}
              label={fieldLabels.get(field) ?? field}
              oldValue={diff.old}
              newValue={diff.new}
            />
          ))}
        </div>
      )}
    </div>
  );
}
