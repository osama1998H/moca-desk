import { RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StaleDocBannerProps {
  user: string;
  onReload: () => void;
}

export function StaleDocBanner({ user, onReload }: StaleDocBannerProps) {
  return (
    <div className="mb-4 flex items-center justify-between rounded-md border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
      <span>
        This document was modified by <strong>{user}</strong>. Reload to see
        changes.
      </span>
      <Button
        variant="outline"
        size="xs"
        onClick={onReload}
        className="border-amber-300 text-amber-800 hover:bg-amber-50 dark:border-amber-500/30 dark:text-amber-300 dark:hover:bg-amber-500/10"
      >
        <RefreshCwIcon data-icon="inline-start" />
        Reload
      </Button>
    </div>
  );
}
