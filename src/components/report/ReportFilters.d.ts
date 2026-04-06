import type { ReportFilter } from "@/api/types";
interface ReportFiltersProps {
    filters: ReportFilter[];
    values: Record<string, unknown>;
    onChange: (values: Record<string, unknown>) => void;
    onRun: () => void;
    isLoading: boolean;
}
export declare function ReportFilters({ filters, values, onChange, onRun, isLoading, }: ReportFiltersProps): import("react/jsx-runtime").JSX.Element | null;
export {};
