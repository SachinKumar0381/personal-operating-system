"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { GlassCard } from "@/shared/ui/glass-card";
import type { DsaStats } from "@/features/dsa-tracker/types";

interface DsaChartProps {
  stats: DsaStats;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/20 bg-white/80 px-3 py-2 text-xs shadow-lg backdrop-blur-sm dark:bg-black/60 dark:border-white/10">
      <p className="font-medium">{label}</p>
      <p className="text-primary">{payload[0].value} problems</p>
    </div>
  );
}

const DIFFICULTY_COLORS = {
  Easy: "hsl(142 76% 45%)",
  Medium: "hsl(38 92% 50%)",
  Hard: "hsl(0 84% 60%)",
};

export function DsaChart({ stats }: DsaChartProps): React.ReactElement {
  const difficultyData = [
    { name: "Easy", count: stats.easy },
    { name: "Medium", count: stats.medium },
    { name: "Hard", count: stats.hard },
  ];

  const categoryData = stats.byCategory.slice(0, 8);
  const hasData = stats.total > 0;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <GlassCard variant="elevated" padding="md">
        <p className="mb-4 text-sm font-medium">By Difficulty</p>
        {!hasData ? (
          <p className="mt-6 text-center text-sm text-muted-foreground">No problems logged yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={difficultyData} margin={{ top: 4, right: 8, bottom: 4, left: -8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" strokeOpacity={0.08} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {difficultyData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={DIFFICULTY_COLORS[entry.name as keyof typeof DIFFICULTY_COLORS]}
                    fillOpacity={0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </GlassCard>

      <GlassCard variant="elevated" padding="md" className="lg:col-span-2">
        <p className="mb-4 text-sm font-medium">By Category (Top 8)</p>
        {categoryData.length === 0 ? (
          <p className="mt-6 text-center text-sm text-muted-foreground">No data yet.</p>
        ) : (
          <div className="space-y-2.5">
            {categoryData.map((c) => {
              const maxCount = categoryData[0]?.count ?? 1;
              const pct = Math.round((c.count / maxCount) * 100);
              return (
                <div key={c.category}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium">{c.category}</span>
                    <span className="text-muted-foreground">{c.count}</span>
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
