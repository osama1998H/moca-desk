import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface IconRailItem {
  id: string;
  icon: ReactNode;
  label: string;
}

export interface BuilderShellProps {
  toolbar: ReactNode;
  iconRailItems: IconRailItem[];
  activeDrawer: string | null;
  onDrawerToggle: (id: string) => void;
  leftDrawer?: ReactNode;
  rightPanel?: ReactNode;
  statusBar?: ReactNode;
  children: ReactNode; // canvas
}

export function BuilderShell({
  toolbar,
  iconRailItems,
  activeDrawer,
  onDrawerToggle,
  leftDrawer,
  rightPanel,
  statusBar,
  children,
}: BuilderShellProps) {
  return (
    <div className="flex h-screen flex-col">
      {/* Toolbar */}
      {toolbar}

      {/* Middle section */}
      <div className="flex flex-1 overflow-hidden">
        {/* Icon rail */}
        <TooltipProvider>
          <div className="flex w-10 flex-col items-center gap-1 border-r bg-muted/30 py-2">
            {iconRailItems.map((item) => (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "size-8 rounded-md",
                      activeDrawer === item.id &&
                        "bg-accent text-accent-foreground"
                    )}
                    onClick={() => onDrawerToggle(item.id)}
                  >
                    {item.icon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>

        {/* Left drawer */}
        {leftDrawer && activeDrawer && (
          <div className="animate-in slide-in-from-left-2">
            {leftDrawer}
          </div>
        )}

        {/* Canvas */}
        <div className="flex-1 overflow-y-auto bg-muted/10 p-4">
          {children}
        </div>

        {/* Right panel */}
        {rightPanel && (
          <div className="w-64 overflow-y-auto border-l">{rightPanel}</div>
        )}
      </div>

      {/* Status bar */}
      {statusBar && (
        <div className="flex h-6 items-center border-t px-3 text-xs text-muted-foreground">
          {statusBar}
        </div>
      )}
    </div>
  );
}
