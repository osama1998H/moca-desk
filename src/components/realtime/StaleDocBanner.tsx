import { RefreshCwIcon } from "lucide-react";

interface StaleDocBannerProps {
  user: string;
  onReload: () => void;
}

export function StaleDocBanner({ user, onReload }: StaleDocBannerProps) {
  return (
    <div className="mb-4 flex items-center justify-between rounded-md border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
      <span>
        This document was modified by <strong>{user}</strong>. Reload to see
        changes.
      </span>
      <button
        type="button"
        onClick={onReload}
        className="inline-flex items-center gap-1.5 rounded-md border border-amber-300 bg-white px-2.5 py-1 text-xs font-medium text-amber-800 hover:bg-amber-50"
      >
        <RefreshCwIcon className="size-3" />
        Reload
      </button>
    </div>
  );
}
