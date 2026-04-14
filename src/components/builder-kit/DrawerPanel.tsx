import type { ReactNode } from "react";

export interface DrawerPanelProps {
  title?: string;
  children: ReactNode;
}

export function DrawerPanel({ title, children }: DrawerPanelProps) {
  return (
    <div className="h-full w-64 overflow-y-auto overscroll-contain border-r bg-background">
      {title && (
        <div className="sticky top-0 border-b bg-background px-3 py-2 text-sm font-medium">
          {title}
        </div>
      )}
      {children}
    </div>
  );
}
