/**
 * Safe expression evaluator for `depends_on` and `mandatory_depends_on` fields.
 * Uses a regex-based split approach — no eval() or new Function().
 *
 * Supported expression formats:
 *   "eval:doc.status == 'Draft'"
 *   "eval:doc.amount > 0"
 *   "eval:doc.status == 'Draft' && doc.amount > 0"
 *   "eval:doc.status == 'Draft' || doc.is_active"
 *   "eval:doc.is_active"       (truthiness)
 *   "eval:!doc.is_cancelled"   (negation)
 */
type DocValues = Record<string, unknown>;
/**
 * Evaluate a `depends_on` expression against the current document state.
 * Returns `true` if the field should be visible, `false` to hide it.
 * On any parse error, returns `true` (show the field rather than hide it).
 */
export declare function evaluateDependsOn(expression: string | undefined, doc: DocValues): boolean;
/**
 * Evaluate a `mandatory_depends_on` expression. Returns `true` if the field
 * should be treated as required given the current document state.
 */
export declare function evaluateMandatoryDependsOn(expression: string | undefined, doc: DocValues): boolean;
export {};
