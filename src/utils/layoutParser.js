// ── Helpers ────────────────────────────────────────────────────────────────
function makeColumn() {
    return { fields: [] };
}
function makeSection(label = "", collapsible = false, collapsedByDefault = false) {
    return { label, collapsible, collapsedByDefault, columns: [makeColumn()] };
}
function makeTab(label = "Details") {
    return { label, sections: [makeSection()] };
}
/** A column with at least one field. */
function hasFields(col) {
    return col.fields.length > 0;
}
/** A section with at least one non-empty column. */
function sectionHasFields(sec) {
    return sec.columns.some(hasFields);
}
// ── Parser ─────────────────────────────────────────────────────────────────
/**
 * Convert a flat `FieldDef[]` array into a nested tab → section → column → field
 * tree. Layout markers (TabBreak, SectionBreak, ColumnBreak) drive the nesting;
 * all other fields are placed into the current column.
 *
 * The parser does NOT filter hidden fields or evaluate `depends_on` — that is
 * the FormView's responsibility at render time.
 */
export function parseLayout(fields) {
    if (fields.length === 0)
        return { tabs: [] };
    const tabs = [];
    let currentTab = makeTab();
    // makeTab/makeSection always initialize with one section/column
    let currentSection = currentTab.sections[0];
    let currentColumn = currentSection.columns[0];
    for (const field of fields) {
        switch (field.field_type) {
            case "TabBreak": {
                // Finalize current column → section → tab
                currentSection.columns[currentSection.columns.length - 1] =
                    currentColumn;
                tabs.push(currentTab);
                // Start a new tab with a fresh section and column
                currentTab = makeTab(field.layout_label || field.label || "");
                currentSection = currentTab.sections[0];
                currentColumn = currentSection.columns[0];
                break;
            }
            case "SectionBreak": {
                // Finalize current column into current section
                currentSection.columns[currentSection.columns.length - 1] =
                    currentColumn;
                // Push current section into current tab (if it has content or a label)
                // Start a new section
                const newSection = makeSection(field.layout_label || field.label || "", field.collapsible ?? false, field.collapsed_by_default ?? false);
                currentTab.sections.push(newSection);
                currentSection = newSection;
                currentColumn = currentSection.columns[0];
                break;
            }
            case "ColumnBreak": {
                // Finalize current column
                currentSection.columns[currentSection.columns.length - 1] =
                    currentColumn;
                // Start a new column
                const newCol = makeColumn();
                currentSection.columns.push(newCol);
                currentColumn = newCol;
                break;
            }
            default:
                // Data or display field — add to current column
                currentColumn.fields.push(field);
                break;
        }
    }
    // Finalize the last column → section → tab
    currentSection.columns[currentSection.columns.length - 1] = currentColumn;
    tabs.push(currentTab);
    // Clean up: remove empty sections and empty tabs
    for (const tab of tabs) {
        // Remove empty columns (keep at least one per section)
        for (const sec of tab.sections) {
            const nonEmpty = sec.columns.filter(hasFields);
            if (nonEmpty.length > 0) {
                sec.columns = nonEmpty;
            }
        }
        // Remove empty sections that have no label and no fields
        const meaningful = tab.sections.filter((s) => sectionHasFields(s) || s.label);
        if (meaningful.length > 0) {
            tab.sections = meaningful;
        }
    }
    // Remove completely empty tabs (no sections with fields)
    const nonEmptyTabs = tabs.filter((t) => t.sections.some(sectionHasFields));
    return { tabs: nonEmptyTabs.length > 0 ? nonEmptyTabs : tabs.slice(0, 1) };
}
