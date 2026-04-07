import { Outlet } from "react-router";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import Sidebar from "@/components/shell/Sidebar";
import { Topbar } from "@/components/shell/Topbar";
import { CommandPalette } from "@/components/shell/CommandPalette";

export function DeskLayout() {
  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </SidebarInset>
      <CommandPalette />
    </SidebarProvider>
  );
}
