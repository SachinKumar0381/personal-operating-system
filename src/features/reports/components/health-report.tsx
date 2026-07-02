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
import { Dumbbell, Moon, Utensils, Scale } from "lucide-react";
import { GlassCard } from "@/shared/ui/glass-card";
import { ReportStatCard } from "./report-stat-card";
import type { HealthReport } from "@/features/reports/types";

interface HealthReportProps {
  data: HealthReport;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}

function WeightTooltip({ active, payload, label }: TooltipProps): React.ReactElement | null {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/20 bg-white/80 px-3 py-2 text-xs shadow-lg backdrop-blur-sm dark:bg-black/60 dark:border-white/10">
      <p className="font-medium">{label}</p>
      <p className="text-blue-500">{payload[0]?.value} kg</p>
    </div>
  );
}

export function HealthReportSection({ data }: HealthReportProps): React.ReactElement {
  const hasWeightData = data.weightTrend.length > 0;

  return (
    <GlassCard variant="default" padding="lg">
      <h2 className="mb-1 text-base font-semibold">Health Report</h2>
      <p className="mb-5 text-xs text-muted-foreground">
        Weight trend, workouts, sleep quality, and nutrition this month
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-6">
        <ReportStatCard
          label="Workouts / Month"
          value={`${data.workoutFrequency}`}
          sub="sessions logged"
          icon={<Dumbbell size={18} />}
          accent="purple"
        />
        <ReportStatCard
          label="Avg Sleep"
          value={data.avgSleepHours !== null ? `${data.avgSleepHours} hrs` : "—"}
          sub="per night (14 days)"
          icon={<Moon size={18} />}
          accent="yellow"
        />
        <ReportStatCard
          label="Sleep Quality"
          value={data.avgSleepQuality !== null ? `${data.avgSleepQuality} / 5` : "—"}
          sub="average rating"
          icon={<Moon size={18} />}
          accent="blue"
        />
        <ReportStatCard
          label="Avg Calories"
          value={data.avgDailyCalories !== null ? `${data.avgDailyCalories} kcal` : "—"}
          sub="per meal day"
          icon={<Utensils size={18} />}
          accent="orange"
        />
      </div>

      <div>
        <div className="mb-3 flex items-center gap-2">
          <Scale size={14} className="text-muted-foreground" />
          <p className="text-sm font-medium">Weight Trend (last 30 entries)</p>
        </div>
        {hasWeightData ? (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={data.weightTrend}
              margin={{ top: 4, right: 8, bottom: 4, left: -8 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                strokeOpacity={0.08}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "currentColor", opacity: 0.5 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 10, fill: "currentColor", opacity: 0.5 }}
                tickLine={false}
                axisLine={false}
                domain={["auto", "auto"]}
              />
              <Tooltip content={<WeightTooltip />} />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="hsl(221 83% 60%)"
                strokeWidth={2}
                dot={{ r: 3, fill: "hsl(221 83% 60%)" }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Log weight entries to see your trend.
          </p>
        )}
      </div>
    </GlassCard>
  );
}
