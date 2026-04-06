import type { FieldDef, FieldType, DocRecord } from "@/api/types";
export interface FieldProps<V = unknown> {
    fieldDef: FieldDef;
    value: V;
    onChange: (value: V) => void;
    readOnly?: boolean;
    error?: string;
    doc?: DocRecord;
    className?: string;
}
export interface LayoutFieldProps {
    fieldDef: FieldDef;
    children?: React.ReactNode;
    className?: string;
}
export declare const LAYOUT_TYPES: Set<FieldType>;
type AnyFieldComponent = React.ComponentType<any>;
export declare const FIELD_TYPE_MAP: Partial<Record<FieldType, React.LazyExoticComponent<AnyFieldComponent>>>;
export {};
