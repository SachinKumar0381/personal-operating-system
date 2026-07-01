"use client";

import { Moon, Star, Activity, Clock } from "lucide-react";
import { GlassCard } from "@/shared/ui/glass-card";
import { cn } from "@/shared/utils/cn";
import type { SleepStats } from "@/features/sleep-tracker/types";

interface SleepStatsProps {
  stats: SleepStats;
}

interface StatItemProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  sub?: string;
  accent?: "default" | "green" | "yellow" | "blue" | "purple";
}

function StatItem({ label, value, icon, sub, accent = "default" }: StatItemProps) {
  return (
    <GlassCard variant="elevated" padding="md" className="flex items-start gap-4">
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
          accent === "green" && "bg-green-500/15 text-green-500",
          accent === "yellow" && "bg-yellow-500/15 text-yellow-500",
          accent === "blue" && "bg-blue-500/15 text-blue-500",
          accent === "purple" && "bg-purple-500/15 text-purple-500",
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

function formatDuration(hours: number | null): string {
  if (hours === null) return "—";
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function SleepStats({ stats }: SleepStatsProps): React.ReactElement {
  const { avgDuration, avgQuality, totalEntries, lastNightDuration, lastNightQuality } = stats;

  const durationAccent =
    lastNightDuration === null ? "default" : lastNightDuration >= 7 ? "green" : lastNightDuration >= 6 ? "yellow" : "default";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatItem
        label="Last Night"
        value={formatDuration(lastNightDuration)}
        icon={<Clock size={20} />}
        sub={lastNightQuality !== null ? `Quality: ${lastNightQuality}/5` : "No data"}
        accent={durationAccent}
      />
      <StatItem
        label="7-Day Avg Duration"
        value={formatDuration(avgDuration)}
        icon={<Moon size={20} />}
        sub="This week"
        accent="blue"
      />
      <StatItem
        label="7-Day Avg Quality"
        value={avgQuality !== null ? `${avgQuality.toFixed(1)} / 5` : "—"}
        icon={<Star size={20} />}
        sub="This week"
        accent="yellow"
      />
      <StatItem
        label="Total Entries"
        value={String(totalEntries)}
        icon={<Activity size={20} />}
        sub="All time logs"
        accent="purple"
      />
    </div>
  );
}
