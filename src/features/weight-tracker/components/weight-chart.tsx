"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { GlassCard } from "@/shared/ui/glass-card";
import type { WeightEntry } from "@/features/weight-tracker/types";

interface WeightChartProps {
  entries: WeightEntry[];
}

interface ChartDataPoint {
  date: string;
  weight: number;
  unit: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: ChartDataPoint }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/20 bg-white/80 px-3 py-2 text-xs shadow-lg backdrop-blur-sm dark:bg-black/60 dark:border-white/10">
      <p className="font-medium">{label}</p>
      <p className="text-primary">
        {payload[0].value} {payload[0].payload.unit}
      </p>
    </div>
  );
}

export function WeightChart({ entries }: WeightChartProps): React.ReactElement {
  const data: ChartDataPoint[] = [...entries]
    .reverse()
    .slice(-30)
    .map((e) => ({
      date: format(new Date(e.date), "d MMM"),
      weight: e.weight,
      unit: e.unit,
    }));

  if (data.length < 2) {
    return (
      <GlassCard variant="elevated" padding="md">
        <p className="text-sm font-medium">Weight Trend</p>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Log at least 2 entries to see your chart.
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard variant="elevated" padding="md">
      <p className="mb-4 text-sm font-medium">Weight Trend (Last 30 entries)</p>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: -8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.08} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={["auto", "auto"]}
            tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="hsl(221 83% 53%)"
            strokeWidth={2}
            dot={{ r: 3, fill: "hsl(221 83% 53%)", strokeWidth: 0 }}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </GlassCard>
  );
}
