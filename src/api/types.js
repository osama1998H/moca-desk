// ── Field Types ─────────────────────────────────────────────────────────────
// Mirrors pkg/meta/fielddef.go FieldType constants (29 storage + 6 layout).
// ── Permissions ─────────────────────────────────────────────────────────────
// Mirrors pkg/auth/permission.go bitmask values.
export const Perm = {
    Read: 1,
    Write: 2,
    Create: 4,
    Delete: 8,
    Submit: 16,
    Cancel: 32,
    Amend: 64,
};
