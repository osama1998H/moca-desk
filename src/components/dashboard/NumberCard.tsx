import { Loader2Icon } from "lucide-react";
import { useDashboardWidget } from "@/providers/DashboardProvider";

interface NumberCardProps {
  dashboardName: string;
  widgetIdx: number;
  config: Record<string, unknown>;
}

export function NumberCard({
  dashboardName,
  widgetIdx,
  config,
}: NumberCardProps) {
  const { data, isLoading, error } = useDashboardWidget(
    dashboardName,
    widgetIdx,
  );

  const label = (config.label as string) ?? "Total";
  const color = (config.color as string) ?? "#3b82f6";

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div
        className="mb-2 h-1 w-10 rounded-full"
        style={{ backgroundColor: color }}
      />
      <p className="text-sm text-muted-foreground">{label}</p>
      {isLoading ? (
        <Loader2Icon className="mt-2 size-5 animate-spin text-muted-foreground" />
      ) : error ? (
        <p className="mt-1 text-sm text-destructive">Failed to load</p>
      ) : (
        <p className="mt-1 text-3xl font-semibold text-foreground">
          {formatNumber(data?.value)}
        </p>
      )}
    </div>
  );
}

function formatNumber(value: unknown): string {
  if (value == null) return "0";
  if (typeof value === "number") return value.toLocaleString();
  return String(value);
}
