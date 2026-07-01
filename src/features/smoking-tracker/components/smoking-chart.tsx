"use client";

import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
} from "recharts";
import { format, subDays } from "date-fns";
import { GlassCard } from "@/shared/ui/glass-card";
import type { SmokingEntry } from "@/features/smoking-tracker/types";

interface SmokingChartProps {
  entries: SmokingEntry[];
}

interface ChartDataPoint {
  date: string;
  cigarettes: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const cigarettes = payload[0]?.value ?? 0;
  return (
    <div className="rounded-xl border border-white/20 bg-white/80 px-3 py-2 text-xs shadow-lg backdrop-blur-sm dark:bg-black/60 dark:border-white/10">
      <p className="mb-1 font-medium">{label}</p>
      <p className={cigarettes === 0 ? "text-green-500" : "text-red-400"}>
        {cigarettes === 0 ? "Smoke-free" : `${cigarettes} cigarette${cigarettes > 1 ? "s" : ""}`}
      </p>
    </div>
  );
}

export function SmokingChart({ entries }: SmokingChartProps): React.ReactElement {
  // Aggregate entries by date (sum cigarettes per day) for last 30 days
  const today = new Date();
  const dailyMap = new Map<string, number>();

  for (const entry of entries) {
    const key = format(new Date(entry.date), "d MMM");
    dailyMap.set(key, (dailyMap.get(key) ?? 0) + entry.cigarettesSmoked);
  }

  const data: ChartDataPoint[] = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(today, 29 - i);
    const key = format(date, "d MMM");
    return {
      date: key,
      cigarettes: dailyMap.get(key) ?? 0,
    };
  });

  const hasData = entries.length > 0;

  if (!hasData) {
    return (
      <GlassCard variant="elevated" padding="md">
        <p className="text-sm font-medium">Cigarettes Per Day (Last 30 days)</p>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Log your first entry to see your trend.
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard variant="elevated" padding="md">
      <p className="mb-4 text-sm font-medium">Cigarettes Per Day (Last 30 days)</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.08} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "currentColor", opacity: 0.6 }}
            tickLine={false}
            axisLine={false}
            interval={4}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="cigarettes"
            name="cigarettes"
            fill="hsl(0 72% 51%)"
            fillOpacity={0.7}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-red-500/70" />
          Cigarettes smoked
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-green-500/70" />
          0 = smoke-free day
        </span>
      </div>
    </GlassCard>
  );
}
