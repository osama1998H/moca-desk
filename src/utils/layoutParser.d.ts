import type { FieldDef } from "@/api/types";
export interface ParsedColumn {
    fields: FieldDef[];
}
export interface ParsedSection {
    label: string;
    collapsible: boolean;
    collapsedByDefault: boolean;
    columns: ParsedColumn[];
}
export interface ParsedTab {
    label: string;
    sections: ParsedSection[];
}
export interface ParsedLayout {
    tabs: ParsedTab[];
}
/**
 * Convert a flat `FieldDef[]` array into a nested tab → section → column → field
 * tree. Layout markers (TabBreak, SectionBreak, ColumnBreak) drive the nesting;
 * all other fields are placed into the current column.
 *
 * The parser does NOT filter hidden fields or evaluate `depends_on` — that is
 * the FormView's responsibility at render time.
 */
export declare function parseLayout(fields: FieldDef[]): ParsedLayout;
