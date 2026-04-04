import type { DocRecord } from "@/api/types";
/**
 * Track whether form values have changed from their initial state.
 *
 * @param current  The current form values (local state in FormView).
 * @param initial  The document snapshot from the server (or undefined while loading).
 * @returns `isDirty` and the set of changed field names.
 */
export declare function useDirtyTracking(current: DocRecord, initial: DocRecord | undefined): {
    isDirty: boolean;
    dirtyFields: Set<string>;
};
