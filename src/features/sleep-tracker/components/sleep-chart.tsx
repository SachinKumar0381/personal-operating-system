"use client";

import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from "recharts";
import { format } from "date-fns";
import { GlassCard } from "@/shared/ui/glass-card";
import type { SleepEntry } from "@/features/sleep-tracker/types";

interface SleepChartProps {
  entries: SleepEntry[];
}

interface ChartDataPoint {
  date: string;
  duration: number;
  quality: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const duration = payload.find((p) => p.name === "duration");
  const quality = payload.find((p) => p.name === "quality");
  return (
    <div className="rounded-xl border border-white/20 bg-white/80 px-3 py-2 text-xs shadow-lg backdrop-blur-sm dark:bg-black/60 dark:border-white/10">
      <p className="mb-1 font-medium">{label}</p>
      {duration && (
        <p className="text-blue-500">
          Sleep: {duration.value}h
        </p>
      )}
      {quality && (
        <p className="text-purple-500">
          Quality: {quality.value}/5
        </p>
      )}
    </div>
  );
}

export function SleepChart({ entries }: SleepChartProps): React.ReactElement {
  const data: ChartDataPoint[] = [...entries]
    .reverse()
    .slice(-14)
    .map((e) => ({
      date: format(new Date(e.date), "d MMM"),
      duration: e.duration,
      quality: e.quality,
    }));

  if (data.length < 2) {
    return (
      <GlassCard variant="elevated" padding="md">
        <p className="text-sm font-medium">Sleep Trend (Last 14 days)</p>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Log at least 2 entries to see your chart.
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard variant="elevated" padding="md">
      <p className="mb-4 text-sm font-medium">Sleep Trend (Last 14 days)</p>
      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: -8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.08} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            yAxisId="left"
            domain={[0, 12]}
            tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }}
            tickLine={false}
            axisLine={false}
            label={{ value: "hours", angle: -90, position: "insideLeft", offset: 10, style: { fontSize: 10, opacity: 0.5 } }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 5]}
            tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            yAxisId="left"
            dataKey="duration"
            name="duration"
            fill="hsl(221 83% 53%)"
            fillOpacity={0.7}
            radius={[4, 4, 0, 0]}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="quality"
            name="quality"
            stroke="hsl(271 83% 60%)"
            strokeWidth={2}
            dot={{ r: 3, fill: "hsl(271 83% 60%)", strokeWidth: 0 }}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-blue-500/70" />
          Duration (h)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-purple-500" />
          Quality (1–5)
        </span>
      </div>
    </GlassCard>
  );
}
