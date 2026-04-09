import { Loader2Icon } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useDashboardWidget } from "@/providers/DashboardProvider";

interface ChartWidgetProps {
  dashboardName: string;
  widgetIdx: number;
  config: Record<string, unknown>;
}

export function ChartWidget({
  dashboardName,
  widgetIdx,
  config,
}: ChartWidgetProps) {
  const { data, isLoading, error } = useDashboardWidget(
    dashboardName,
    widgetIdx,
  );

  const label = (config.label as string) ?? "Chart";
  const chartType = ((config.chart_type as string) ?? "bar").toLowerCase();
  const chartData = (data?.data as Record<string, unknown>[]) ?? [];

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <p className="mb-3 text-sm font-medium text-foreground">{label}</p>
      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <p className="text-sm text-destructive">Failed to load chart</p>
      ) : chartData.length === 0 ? (
        <p className="text-sm text-muted-foreground">No data</p>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          {chartType === "line" ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="period"
                tick={{ fontSize: 11 }}
                tickFormatter={formatPeriod}
              />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip labelFormatter={formatPeriod} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
              />
            </LineChart>
          ) : (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="period"
                tick={{ fontSize: 11 }}
                tickFormatter={formatPeriod}
              />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip labelFormatter={formatPeriod} />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          )}
        </ResponsiveContainer>
      )}
    </div>
  );
}

function formatPeriod(value: unknown): string {
  if (!value) return "";
  const s = String(value);
  // Truncate ISO date to YYYY-MM-DD
  if (s.length > 10 && s.includes("T")) return s.slice(0, 10);
  return s;
}
