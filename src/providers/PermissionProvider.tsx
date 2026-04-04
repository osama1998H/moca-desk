import { useMetaType } from "./MetaProvider";
import type { Permissions } from "@/api/types";

/**
 * Derives permissions from the MetaType's allow_* flags.
 * These reflect the global API config for the doctype. Per-user permission
 * resolution requires a backend enhancement (future milestone).
 */
export function usePermissions(doctype: string): Permissions & {
  isLoading: boolean;
} {
  const { data: meta, isLoading } = useMetaType(doctype);

  if (!meta) {
    return {
      canRead: false,
      canWrite: false,
      canCreate: false,
      canDelete: false,
      canSubmit: false,
      canCancel: false,
      isLoading,
    };
  }

  return {
    canRead: meta.allow_get,
    canWrite: meta.allow_update,
    canCreate: meta.allow_create,
    canDelete: meta.allow_delete,
    canSubmit: meta.is_submittable,
    canCancel: meta.is_submittable,
    isLoading,
  };
}
