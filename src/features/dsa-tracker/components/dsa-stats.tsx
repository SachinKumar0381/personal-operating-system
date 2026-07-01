"use client";

import { CheckCircle2, Target, Zap, BarChart2 } from "lucide-react";
import { GlassCard } from "@/shared/ui/glass-card";
import { cn } from "@/shared/utils/cn";
import type { DsaStats } from "@/features/dsa-tracker/types";

interface DsaStatsProps {
  stats: DsaStats;
}

interface StatItemProps {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  accent?: "blue" | "green" | "yellow" | "purple" | "orange";
}

function StatItem({ label, value, sub, icon, accent = "blue" }: StatItemProps) {
  return (
    <GlassCard variant="elevated" padding="md" className="flex items-start gap-4">
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
          accent === "blue" && "bg-blue-500/15 text-blue-500",
          accent === "green" && "bg-green-500/15 text-green-500",
          accent === "yellow" && "bg-yellow-500/15 text-yellow-500",
          accent === "purple" && "bg-purple-500/15 text-purple-500",
          accent === "orange" && "bg-orange-500/15 text-orange-500"
        )}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-xl font-semibold tabular-nums">{value}</p>
        {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
      </div>
    </GlassCard>
  );
}

export function DsaStats({ stats }: DsaStatsProps): React.ReactElement {
  const progressPct = stats.goal > 0 ? Math.min(100, Math.round((stats.solved / stats.goal) * 100)) : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatItem
          label="Problems Solved"
          value={String(stats.solved)}
          sub={`of ${stats.goal} goal`}
          icon={<CheckCircle2 size={20} />}
          accent="green"
        />
        <StatItem
          label="Total Logged"
          value={String(stats.total)}
          sub={`${stats.attempted} attempted · ${stats.revisit} to revisit`}
          icon={<BarChart2 size={20} />}
          accent="blue"
        />
        <StatItem
          label="By Difficulty"
          value={`${stats.easy}E / ${stats.medium}M / ${stats.hard}H`}
          sub="Easy / Medium / Hard"
          icon={<Zap size={20} />}
          accent="yellow"
        />
        <StatItem
          label="Goal Progress"
          value={`${progressPct}%`}
          sub={`${stats.solved} / ${stats.goal} solved`}
          icon={<Target size={20} />}
          accent="purple"
        />
      </div>

      <GlassCard variant="elevated" padding="md">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-medium text-muted-foreground">Progress toward {stats.goal} problems</span>
          <span className="font-semibold text-primary">{stats.solved} / {stats.goal}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10 dark:bg-white/5">
          <div
            className="h-full rounded-full bg-primary/80 transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </GlassCard>
    </div>
  );
}
