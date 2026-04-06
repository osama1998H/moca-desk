import { useMemo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { ChartConfig, ReportColumn, DocRecord } from "@/api/types";

interface ReportChartProps {
  config: ChartConfig;
  columns: ReportColumn[];
  data: DocRecord[];
}

const COLORS = [
  "#3b82f6",
  "#ef4444",
  "#22c55e",
  "#f59e0b",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#14b8a6",
];

export function ReportChart({ config, columns, data }: ReportChartProps) {
  const { labelCol, numericCols } = useMemo(() => {
    const label = columns[0];
    const numeric = columns.filter(
      (c) =>
        c !== label &&
        ["Int", "Float", "Currency", "Percent"].includes(c.field_type),
    );
    return { labelCol: label, numericCols: numeric.length > 0 ? numeric : columns.slice(1) };
  }, [columns]);

  if (data.length === 0) return null;

  const chartType = config.type?.toLowerCase() ?? "bar";

  if (chartType === "pie") {
    const valueCol = numericCols[0];
    if (!valueCol) return null;
    return (
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey={valueCol.field_name}
              nameKey={labelCol?.field_name}
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (chartType === "line") {
    return (
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={labelCol?.field_name} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            {numericCols.map((col, i) => (
              <Line
                key={col.field_name}
                type="monotone"
                dataKey={col.field_name}
                name={col.label}
                stroke={COLORS[i % COLORS.length]}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Default: bar chart
  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={labelCol?.field_name} tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          {numericCols.map((col, i) => (
            <Bar
              key={col.field_name}
              dataKey={col.field_name}
              name={col.label}
              fill={COLORS[i % COLORS.length]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
