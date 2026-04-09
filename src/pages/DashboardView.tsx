import { useParams } from "react-router";
import { Loader2Icon } from "lucide-react";
import { useDashboardDef } from "@/providers/DashboardProvider";
import { NumberCard } from "@/components/dashboard/NumberCard";
import { ChartWidget } from "@/components/dashboard/ChartWidget";
import { ListWidget } from "@/components/dashboard/ListWidget";
import { ShortcutCard } from "@/components/dashboard/ShortcutCard";
import { getCustomWidgets } from "@/lib/widgetRegistry";

export function DashboardView() {
  const { name = "" } = useParams<{ name: string }>();
  const { data: dash, isLoading, error } = useDashboardDef(name);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2Icon className="size-4 animate-spin" />
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        {error.message}
      </div>
    );
  }

  if (!dash) return null;

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-foreground">
        {dash.label || dash.name}
      </h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {dash.widgets.map((widget, idx) => {
          switch (widget.type) {
            case "number_card":
              return (
                <NumberCard
                  key={idx}
                  dashboardName={name}
                  widgetIdx={idx}
                  config={widget.config}
                />
              );
            case "chart":
              return (
                <div key={idx} className="md:col-span-2">
                  <ChartWidget
                    dashboardName={name}
                    widgetIdx={idx}
                    config={widget.config}
                  />
                </div>
              );
            case "list":
              return (
                <ListWidget
                  key={idx}
                  dashboardName={name}
                  widgetIdx={idx}
                  config={widget.config}
                />
              );
            case "shortcut":
              return <ShortcutCard key={idx} config={widget.config} />;
            default:
              return null;
          }
        })}
        {getCustomWidgets().map((w) => (
          <w.component key={w.name} />
        ))}
      </div>
    </div>
  );
}

export default DashboardView;
