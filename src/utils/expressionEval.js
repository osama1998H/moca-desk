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
// ── Value resolution ───────────────────────────────────────────────────────
function resolveDocValue(path, doc) {
    // "doc.field_name" → doc["field_name"]
    const trimmed = path.trim();
    if (trimmed.startsWith("doc.")) {
        return doc[trimmed.slice(4)];
    }
    return undefined;
}
function parseLiteral(raw) {
    const trimmed = raw.trim();
    // String literals: 'value' or "value"
    if ((trimmed.startsWith("'") && trimmed.endsWith("'")) ||
        (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
        return trimmed.slice(1, -1);
    }
    // Boolean
    if (trimmed === "true")
        return true;
    if (trimmed === "false")
        return false;
    // Null / undefined
    if (trimmed === "null" || trimmed === "undefined")
        return null;
    // Number
    const num = Number(trimmed);
    if (!isNaN(num) && trimmed !== "")
        return num;
    return trimmed;
}
// ── Clause evaluation ──────────────────────────────────────────────────────
const COMPARISON_RE = /^([\w.!]+)\s*(==|!=|>=|<=|>|<)\s*(.+)$/;
function evaluateClause(clause, doc) {
    const trimmed = clause.trim();
    if (!trimmed)
        return true;
    // Check for comparison operators
    const match = COMPARISON_RE.exec(trimmed);
    if (match) {
        const leftRaw = match[1];
        const op = match[2];
        const rightRaw = match[3];
        const left = resolveDocValue(leftRaw, doc);
        const right = rightRaw.trim().startsWith("doc.")
            ? resolveDocValue(rightRaw.trim(), doc)
            : parseLiteral(rightRaw);
        switch (op) {
            case "==":
                return left == right; // eslint-disable-line eqeqeq
            case "!=":
                return left != right; // eslint-disable-line eqeqeq
            case ">":
                return Number(left) > Number(right);
            case "<":
                return Number(left) < Number(right);
            case ">=":
                return Number(left) >= Number(right);
            case "<=":
                return Number(left) <= Number(right);
            default:
                return true;
        }
    }
    // Negation: !doc.field_name
    if (trimmed.startsWith("!")) {
        const value = resolveDocValue(trimmed.slice(1), doc);
        return !value;
    }
    // Truthiness: doc.field_name
    const value = resolveDocValue(trimmed, doc);
    return Boolean(value);
}
// ── Main evaluator ─────────────────────────────────────────────────────────
/**
 * Evaluate a `depends_on` expression against the current document state.
 * Returns `true` if the field should be visible, `false` to hide it.
 * On any parse error, returns `true` (show the field rather than hide it).
 */
export function evaluateDependsOn(expression, doc) {
    if (!expression)
        return true;
    try {
        // Strip "eval:" prefix
        let expr = expression.trim();
        if (expr.startsWith("eval:")) {
            expr = expr.slice(5).trim();
        }
        if (!expr)
            return true;
        // Split on || for OR groups
        const orGroups = expr.split("||");
        return orGroups.some((group) => {
            // Split each OR group on && for AND clauses
            const andClauses = group.split("&&");
            return andClauses.every((clause) => evaluateClause(clause, doc));
        });
    }
    catch {
        // On error, show the field
        return true;
    }
}
/**
 * Evaluate a `mandatory_depends_on` expression. Returns `true` if the field
 * should be treated as required given the current document state.
 */
export function evaluateMandatoryDependsOn(expression, doc) {
    return evaluateDependsOn(expression, doc);
}
