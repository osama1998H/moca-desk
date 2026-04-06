import type { DocUpdateEvent } from "@/api/ws-types";
/**
 * Subscribe to real-time updates for a specific document.
 * Returns the latest event and whether the document is stale (remote change
 * arrived since the hook was mounted or reset).
 */
export declare function useRealtimeDoc(doctype: string, name: string): {
    lastEvent: DocUpdateEvent | null;
    isStale: boolean;
};
