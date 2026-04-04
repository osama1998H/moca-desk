import type { FieldDef } from "@/api/types";
interface FieldWrapperProps {
    fieldDef: FieldDef;
    error?: string;
    className?: string;
    children: React.ReactNode;
}
export declare function FieldWrapper({ fieldDef, error, className, children, }: FieldWrapperProps): import("react/jsx-runtime").JSX.Element;
export default FieldWrapper;
