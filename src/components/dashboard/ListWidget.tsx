import { Link } from "react-router";
import { Loader2Icon } from "lucide-react";
import { useDashboardWidget } from "@/providers/DashboardProvider";

interface ListWidgetProps {
  dashboardName: string;
  widgetIdx: number;
  config: Record<string, unknown>;
}

export function ListWidget({
  dashboardName,
  widgetIdx,
  config,
}: ListWidgetProps) {
  const { data, isLoading, error } = useDashboardWidget(
    dashboardName,
    widgetIdx,
  );

  const label = (config.label as string) ?? "Recent";
  const doctype = (config.doctype as string) ?? "";
  const items = (data?.data as Record<string, unknown>[]) ?? [];

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <p className="mb-3 text-sm font-medium text-foreground">{label}</p>
      {isLoading ? (
        <div className="flex h-24 items-center justify-center">
          <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <p className="text-sm text-destructive">Failed to load</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No records</p>
      ) : (
        <ul className="divide-y divide-border">
          {items.map((item, i) => (
            <li key={i}>
              <Link
                to={`/desk/app/${doctype}/${encodeURIComponent(String(item.name ?? ""))}`}
                className="flex items-center justify-between py-2 text-sm hover:text-primary"
              >
                <span className="truncate text-foreground">
                  {item.name != null ? String(item.name) : ""}
                </span>
                {item.modified != null && (
                  <span className="ms-2 shrink-0 text-xs text-muted-foreground">
                    {String(item.modified).slice(0, 10)}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
