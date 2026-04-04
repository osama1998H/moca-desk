import { useMemo } from "react";
import type { DocRecord } from "@/api/types";

/** Keys managed by the server — never count as user-dirty. */
const SKIP_KEYS = new Set([
  "name",
  "creation",
  "modified",
  "modified_by",
  "owner",
  "docstatus",
  "idx",
  "_extra",
]);

function valuesEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a == null && b == null) return true;

  // Compare arrays / objects by JSON (handles child table rows)
  if (typeof a === "object" || typeof b === "object") {
    try {
      return JSON.stringify(a) === JSON.stringify(b);
    } catch {
      return false;
    }
  }

  // Loose comparison for number/string coercion (e.g., 0 vs "0")
  // eslint-disable-next-line eqeqeq
  return String(a) === String(b);
}

/**
 * Track whether form values have changed from their initial state.
 *
 * @param current  The current form values (local state in FormView).
 * @param initial  The document snapshot from the server (or undefined while loading).
 * @returns `isDirty` and the set of changed field names.
 */
export function useDirtyTracking(
  current: DocRecord,
  initial: DocRecord | undefined,
): { isDirty: boolean; dirtyFields: Set<string> } {
  return useMemo(() => {
    const dirtyFields = new Set<string>();

    if (!initial) {
      return { isDirty: false, dirtyFields };
    }

    // Check all keys in current
    for (const key of Object.keys(current)) {
      if (SKIP_KEYS.has(key)) continue;
      if (!valuesEqual(current[key], initial[key])) {
        dirtyFields.add(key);
      }
    }

    // Check keys only in initial (field was removed / cleared)
    for (const key of Object.keys(initial)) {
      if (SKIP_KEYS.has(key)) continue;
      if (!(key in current) && initial[key] != null && initial[key] !== "") {
        dirtyFields.add(key);
      }
    }

    return { isDirty: dirtyFields.size > 0, dirtyFields };
  }, [current, initial]);
}
