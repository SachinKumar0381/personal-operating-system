"use client";

import { TrendingDown, TrendingUp, Minus, Scale, Activity } from "lucide-react";
import { GlassCard } from "@/shared/ui/glass-card";
import { cn } from "@/shared/utils/cn";
import type { WeightStats } from "@/features/weight-tracker/types";

interface WeightStatsProps {
  stats: WeightStats;
}

interface StatItemProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  sub?: string;
  accent?: "default" | "green" | "red" | "blue";
}

function StatItem({ label, value, icon, sub, accent = "default" }: StatItemProps) {
  return (
    <GlassCard variant="elevated" padding="md" className="flex items-start gap-4">
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
          accent === "green" && "bg-green-500/15 text-green-500",
          accent === "red" && "bg-red-500/15 text-red-500",
          accent === "blue" && "bg-blue-500/15 text-blue-500",
          accent === "default" && "bg-primary/10 text-primary"
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

export function WeightStats({ stats }: WeightStatsProps): React.ReactElement {
  const { currentWeight, change, unit, totalEntries } = stats;

  const changeAccent = change === null ? "default" : change < 0 ? "green" : change > 0 ? "red" : "default";
  const ChangeIcon =
    change === null ? Minus : change < 0 ? TrendingDown : change > 0 ? TrendingUp : Minus;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatItem
        label="Current Weight"
        value={currentWeight !== null ? `${currentWeight} ${unit}` : "—"}
        icon={<Scale size={20} />}
        sub="Latest recorded"
        accent="blue"
      />
      <StatItem
        label="Change"
        value={change !== null ? `${change > 0 ? "+" : ""}${change} ${unit}` : "—"}
        icon={<ChangeIcon size={20} />}
        sub="Since last entry"
        accent={changeAccent}
      />
      <StatItem
        label="Total Entries"
        value={String(totalEntries)}
        icon={<Activity size={20} />}
        sub="All time logs"
        accent="default"
      />
    </div>
  );
}
