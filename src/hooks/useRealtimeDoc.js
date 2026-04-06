import { useEffect, useState } from "react";
import { useWebSocket } from "@/providers/WebSocketProvider";
/**
 * Subscribe to real-time updates for a specific document.
 * Returns the latest event and whether the document is stale (remote change
 * arrived since the hook was mounted or reset).
 */
export function useRealtimeDoc(doctype, name) {
    const { subscribe } = useWebSocket();
    const [lastEvent, setLastEvent] = useState(null);
    useEffect(() => {
        // Reset on navigation to a different document.
        setLastEvent(null);
        if (!doctype || !name)
            return;
        return subscribe(doctype, (event) => {
            if (event.name === name) {
                setLastEvent(event);
            }
        });
    }, [doctype, name, subscribe]);
    return { lastEvent, isStale: lastEvent !== null };
}
