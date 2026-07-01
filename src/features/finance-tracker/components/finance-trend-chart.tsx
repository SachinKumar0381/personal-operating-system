"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { GlassCard } from "@/shared/ui/glass-card";
import type { MonthlyTrend } from "@/features/finance-tracker/types";

interface FinanceTrendChartProps {
  data: MonthlyTrend[];
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps): React.ReactElement | null {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/20 bg-white/80 px-3 py-2 text-xs shadow-lg backdrop-blur-sm dark:bg-black/60 dark:border-white/10 space-y-1">
      <p className="font-medium">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: ₹{p.value.toLocaleString("en-IN")}
        </p>
      ))}
    </div>
  );
}

const hasData = (data: MonthlyTrend[]) =>
  data.some((d) => d.income > 0 || d.expenses > 0 || d.savings > 0);

export function FinanceTrendChart({ data }: FinanceTrendChartProps): React.ReactElement {
  if (!hasData(data)) {
    return (
      <GlassCard variant="elevated" padding="md">
        <p className="mb-4 text-sm font-medium">Monthly Trend (Last 6 Months)</p>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Add transactions to see the monthly trend.
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard variant="elevated" padding="md">
      <p className="mb-4 text-sm font-medium">Monthly Trend (Last 6 Months)</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: -8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.08} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
            formatter={(value: string) =>
              value.charAt(0).toUpperCase() + value.slice(1)
            }
          />
          <Bar dataKey="income" fill="hsl(142 76% 45%)" fillOpacity={0.85} radius={[3, 3, 0, 0]} />
          <Bar dataKey="expenses" fill="hsl(0 84% 60%)" fillOpacity={0.85} radius={[3, 3, 0, 0]} />
          <Bar dataKey="savings" fill="hsl(221 83% 53%)" fillOpacity={0.85} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </GlassCard>
  );
}
