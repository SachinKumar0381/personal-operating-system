"use client";

import { Dumbbell, Clock, Calendar } from "lucide-react";
import { GlassCard } from "@/shared/ui/glass-card";
import type { WorkoutStats } from "@/features/workout-tracker/types";

interface WorkoutStatsProps {
  stats: WorkoutStats;
}

function StatItem({
  icon: Icon,
  label,
  value,
  colorClass,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  colorClass: string;
}): React.ReactElement {
  return (
    <GlassCard variant="elevated" padding="md" className="flex items-center gap-4">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${colorClass}`}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-semibold tabular-nums">{value}</p>
      </div>
    </GlassCard>
  );
}

function formatDuration(minutes: number): string {
  if (minutes === 0) return "0m";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

export function WorkoutStats({ stats }: WorkoutStatsProps): React.ReactElement {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatItem
        icon={Dumbbell}
        label="Workouts This Week"
        value={String(stats.totalThisWeek)}
        colorClass="bg-violet-500/15 text-violet-500"
      />
      <StatItem
        icon={Clock}
        label="Active Minutes This Week"
        value={formatDuration(stats.minutesThisWeek)}
        colorClass="bg-blue-500/15 text-blue-500"
      />
      <StatItem
        icon={Calendar}
        label="Total Sessions"
        value={String(stats.totalEntries)}
        colorClass="bg-emerald-500/15 text-emerald-500"
      />
    </div>
  );
}
