"use client";

import { Flame, Trophy, ShieldCheck, Cigarette } from "lucide-react";
import { GlassCard } from "@/shared/ui/glass-card";
import { cn } from "@/shared/utils/cn";
import type { SmokingStats } from "@/features/smoking-tracker/types";

interface SmokingStatsProps {
  stats: SmokingStats;
}

interface StatItemProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  sub?: string;
  accent?: "default" | "green" | "yellow" | "blue" | "red" | "orange";
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
          accent === "red" && "bg-red-500/15 text-red-500",
          accent === "orange" && "bg-orange-500/15 text-orange-500",
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

export function SmokingStats({ stats }: SmokingStatsProps): React.ReactElement {
  const {
    currentStreak,
    longestStreak,
    cravingsResisted,
    avgCigarettesToday,
  } = stats;

  const todayDisplay =
    avgCigarettesToday === null
      ? "—"
      : avgCigarettesToday === 0
        ? "Smoke-free! 🎉"
        : String(avgCigarettesToday);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatItem
        label="Today's Cigarettes"
        value={avgCigarettesToday === null ? "—" : String(avgCigarettesToday)}
        icon={<Cigarette size={20} />}
        sub={avgCigarettesToday === 0 ? "Smoke-free today!" : todayDisplay === "—" ? "Not logged yet" : "Keep reducing"}
        accent={avgCigarettesToday === 0 ? "green" : avgCigarettesToday === null ? "default" : "red"}
      />
      <StatItem
        label="Current Streak"
        value={currentStreak === 0 ? "0 days" : `${currentStreak} day${currentStreak > 1 ? "s" : ""}`}
        icon={<Flame size={20} />}
        sub="Consecutive smoke-free days"
        accent={currentStreak > 0 ? "orange" : "default"}
      />
      <StatItem
        label="Longest Streak"
        value={longestStreak === 0 ? "0 days" : `${longestStreak} day${longestStreak > 1 ? "s" : ""}`}
        icon={<Trophy size={20} />}
        sub="Personal best"
        accent="yellow"
      />
      <StatItem
        label="Cravings Resisted"
        value={String(cravingsResisted)}
        icon={<ShieldCheck size={20} />}
        sub="This week"
        accent="blue"
      />
    </div>
  );
}
