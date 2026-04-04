import { Link, Outlet } from "react-router";
import { useAuth } from "@/providers/AuthProvider";

export function DeskLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r border-gray-200 bg-white">
        <div className="flex h-14 items-center border-b border-gray-200 px-4">
          <Link to="/desk/app" className="text-lg font-semibold text-gray-900">
            Moca
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-400">
            Navigation
          </p>
          <Link
            to="/desk/app"
            className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Home
          </Link>
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
          <div className="text-sm text-gray-500">
            {/* Breadcrumbs placeholder — populated by MS-17-T4 */}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">
              {user?.full_name ?? user?.email}
            </span>
            <button
              type="button"
              onClick={() => void logout()}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
