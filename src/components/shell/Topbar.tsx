import { Link, useParams } from "react-router";
import { useAuth } from "@/providers/AuthProvider";
import { useWebSocket } from "@/providers/WebSocketProvider";
import { useMetaType } from "@/providers/MetaProvider";
import { useI18n } from "@/providers/I18nProvider";
import { cn } from "@/lib/utils";
import { LogOutIcon } from "lucide-react";
import { LanguageSwitcher } from "@/components/shell/LanguageSwitcher";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Topbar() {
  const { doctype, name } = useParams<{ doctype: string; name: string }>();
  const { user, logout } = useAuth();
  const { connectionState } = useWebSocket();
  const { t } = useI18n();

  // Only fetch meta when a doctype is present
  const { data: meta } = useMetaType(doctype ?? "");

  const metaLabel = meta?.label || doctype || "";

  const displayName = user?.full_name ?? user?.email ?? "";
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");

  const connectionColor = cn(
    "size-2 rounded-full",
    connectionState === "connected" && "bg-green-500",
    (connectionState === "connecting" || connectionState === "reconnecting") &&
      "animate-pulse bg-amber-500",
    connectionState === "disconnected" && "bg-muted-foreground/50",
  );

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ms-1" />
      <Separator orientation="vertical" className="me-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/desk/app">{t("Home")}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {doctype && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {name ? (
                  <BreadcrumbLink asChild>
                    <Link to={`/desk/app/${doctype}`}>{metaLabel}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{metaLabel}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </>
          )}
          {name && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{name === "new" ? t("New") : name}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ms-auto flex items-center gap-2">
        <span title={connectionState} className={connectionColor} />

        <LanguageSwitcher />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <Avatar size="sm">
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{displayName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem disabled>{t("Profile")}</DropdownMenuItem>
              <DropdownMenuItem disabled>{t("Settings")}</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => void logout()}>
              <LogOutIcon data-icon="inline-start" />
              {t("Log out")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
