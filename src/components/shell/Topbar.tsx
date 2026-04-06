import { Link, useParams } from "react-router";
import { useAuth } from "@/providers/AuthProvider";
import { useWebSocket } from "@/providers/WebSocketProvider";
import { useMetaType } from "@/providers/MetaProvider";
import { cn } from "@/lib/utils";
import { ChevronRightIcon, LogOutIcon } from "lucide-react";

export function Topbar() {
  const { doctype, name } = useParams<{ doctype: string; name: string }>();
  const { user, logout } = useAuth();
  const { connectionState } = useWebSocket();

  // Only fetch meta when a doctype is present
  const { data: meta } = useMetaType(doctype ?? "");

  // Build breadcrumb segments
  const crumbs: { label: string; to?: string }[] = [
    { label: "Home", to: "/desk/app" },
  ];

  if (doctype) {
    crumbs.push({
      label: meta?.label || doctype,
      to: name ? `/desk/app/${doctype}` : undefined,
    });
  }

  if (name) {
    crumbs.push({
      label: name === "new" ? "New" : name,
    });
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1 text-sm">
        {crumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && (
              <ChevronRightIcon className="size-3.5 text-gray-400" />
            )}
            {crumb.to ? (
              <Link
                to={crumb.to}
                className="text-gray-500 hover:text-gray-700"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="font-medium text-gray-900">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>

      {/* User menu */}
      <div className="flex items-center gap-3">
        <span
          title={connectionState}
          className={cn(
            "inline-block size-1.5 rounded-full",
            connectionState === "connected" && "bg-green-500",
            (connectionState === "connecting" ||
              connectionState === "reconnecting") &&
              "animate-pulse bg-amber-500",
            connectionState === "disconnected" && "bg-gray-400",
          )}
        />
        <span className="text-sm text-gray-600">
          {user?.full_name ?? user?.email}
        </span>
        <button
          type="button"
          onClick={() => void logout()}
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <LogOutIcon className="size-3.5" />
          Logout
        </button>
      </div>
    </header>
  );
}
