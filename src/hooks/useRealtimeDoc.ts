import { useEffect, useState } from "react";
import { useWebSocket } from "@/providers/WebSocketProvider";
import type { DocUpdateEvent } from "@/api/ws-types";

/**
 * Subscribe to real-time updates for a specific document.
 * Returns the latest event and whether the document is stale (remote change
 * arrived since the hook was mounted or reset).
 */
export function useRealtimeDoc(
  doctype: string,
  name: string,
): { lastEvent: DocUpdateEvent | null; isStale: boolean } {
  const { subscribe } = useWebSocket();
  const [lastEvent, setLastEvent] = useState<DocUpdateEvent | null>(null);

  useEffect(() => {
    // Reset on navigation to a different document.
    setLastEvent(null);

    if (!doctype || !name) return;

    return subscribe(doctype, (event) => {
      if (event.name === name) {
        setLastEvent(event);
      }
    });
  }, [doctype, name, subscribe]);

  return { lastEvent, isStale: lastEvent !== null };
}
