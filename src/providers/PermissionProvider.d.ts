import type { Permissions } from "@/api/types";
/**
 * Derives permissions from the MetaType's allow_* flags.
 * These reflect the global API config for the doctype. Per-user permission
 * resolution requires a backend enhancement (future milestone).
 */
export declare function usePermissions(doctype: string): Permissions & {
    isLoading: boolean;
};
