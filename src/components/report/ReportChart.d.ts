import type { ChartConfig, ReportColumn, DocRecord } from "@/api/types";
interface ReportChartProps {
    config: ChartConfig;
    columns: ReportColumn[];
    data: DocRecord[];
}
export declare function ReportChart({ config, columns, data }: ReportChartProps): import("react/jsx-runtime").JSX.Element | null;
export {};
