import { useAuth } from "@/providers/AuthProvider";

export function DeskHome() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">
        Welcome to Moca Desk
      </h1>
      {user && (
        <p className="mt-2 text-gray-600">
          Signed in as {user.full_name || user.email}
        </p>
      )}
    </div>
  );
}
