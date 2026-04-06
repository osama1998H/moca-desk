import type { ReportColumn, DocRecord } from "@/api/types";
interface ReportTableProps {
    columns: ReportColumn[];
    data: DocRecord[];
    isLoading: boolean;
}
export declare function ReportTable({ columns, data, isLoading }: ReportTableProps): import("react/jsx-runtime").JSX.Element;
export {};
