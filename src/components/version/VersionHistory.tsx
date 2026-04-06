import { useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useDocVersions } from "@/hooks/useDocVersions";
import { FieldDiff } from "@/components/version/FieldDiff";
import { cn } from "@/lib/utils";
import { XIcon, ChevronDownIcon, Loader2Icon } from "lucide-react";
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
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-96 flex-col border-l border-gray-200 bg-white shadow-lg transition-transform duration-200",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-900">
            Version History
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <XIcon className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-8 text-gray-400">
              <Loader2Icon className="size-5 animate-spin" />
            </div>
          ) : versions.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">
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
              <button
                type="button"
                onClick={() => void fetchNextPage()}
                disabled={isFetchingNextPage}
                className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                {isFetchingNextPage && (
                  <Loader2Icon className="size-3 animate-spin" />
                )}
                Load more
              </button>
            </div>
          )}
        </div>
      </div>
    </>
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
    <div className="rounded-md border border-gray-100 bg-gray-50/50">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left"
      >
        <div className="min-w-0 flex-1">
          <div className="text-xs font-medium text-gray-900">
            {version.owner}
          </div>
          <div className="text-xs text-gray-500">{relativeTime}</div>
          <div className="mt-0.5 text-xs text-gray-500">
            {isInitial
              ? "Initial version"
              : `Changed ${String(changedCount)} field${changedCount !== 1 ? "s" : ""}`}
          </div>
        </div>
        {!isInitial && changedCount > 0 && (
          <ChevronDownIcon
            className={cn(
              "size-3.5 shrink-0 text-gray-400 transition-transform",
              expanded && "rotate-180",
            )}
          />
        )}
      </button>

      {/* Expanded diff */}
      {expanded && changed && (
        <div className="space-y-2 border-t border-gray-100 px-3 py-2.5">
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
