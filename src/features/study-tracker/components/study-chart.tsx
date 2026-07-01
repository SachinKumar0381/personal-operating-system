"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { GlassCard } from "@/shared/ui/glass-card";
import type { DailyStudyPoint, SubjectStat } from "@/features/study-tracker/types";

interface StudyChartProps {
  dailyPoints: DailyStudyPoint[];
  subjectBreakdown: SubjectStat[];
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const minutes = payload[0].value;
  const display = minutes < 60 ? `${minutes}m` : `${(minutes / 60).toFixed(1)}h`;
  return (
    <div className="rounded-xl border border-white/20 bg-white/80 px-3 py-2 text-xs shadow-lg backdrop-blur-sm dark:bg-black/60 dark:border-white/10">
      <p className="font-medium">{label}</p>
      <p className="text-primary">{display}</p>
    </div>
  );
}

export function StudyChart({ dailyPoints, subjectBreakdown }: StudyChartProps): React.ReactElement {
  const hasData = dailyPoints.some((p) => p.minutes > 0);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <GlassCard variant="elevated" padding="md" className="lg:col-span-2">
        <p className="mb-4 text-sm font-medium">Daily Study Time (Last 14 Days)</p>
        {!hasData ? (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Log sessions to see your daily chart.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dailyPoints} margin={{ top: 4, right: 8, bottom: 4, left: -8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.08} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => (v < 60 ? `${v}m` : `${(v / 60).toFixed(0)}h`)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="minutes"
                fill="hsl(221 83% 53%)"
                radius={[4, 4, 0, 0]}
                fillOpacity={0.85}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </GlassCard>

      <GlassCard variant="elevated" padding="md">
        <p className="mb-4 text-sm font-medium">By Subject</p>
        {subjectBreakdown.length === 0 ? (
          <p className="mt-6 text-center text-sm text-muted-foreground">No data yet.</p>
        ) : (
          <div className="space-y-3">
            {subjectBreakdown.slice(0, 6).map((s) => {
              const maxMinutes = subjectBreakdown[0]?.totalMinutes ?? 1;
              const pct = Math.round((s.totalMinutes / maxMinutes) * 100);
              const display =
                s.totalMinutes < 60
                  ? `${s.totalMinutes}m`
                  : `${(s.totalMinutes / 60).toFixed(1)}h`;
              return (
                <div key={s.subject}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium">{s.subject}</span>
                    <span className="text-muted-foreground">{display}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10 dark:bg-white/5">
                    <div
                      className="h-full rounded-full bg-primary/70 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
