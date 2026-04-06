import type { FieldDef } from "@/api/types";
interface VersionHistoryProps {
    doctype: string;
    name: string;
    fields: FieldDef[];
    open: boolean;
    onClose: () => void;
}
export declare function VersionHistory({ doctype, name, fields, open, onClose, }: VersionHistoryProps): import("react/jsx-runtime").JSX.Element;
export {};
