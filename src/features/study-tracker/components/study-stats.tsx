"use client";

import { Clock, BookOpen, BarChart2, TrendingUp } from "lucide-react";
import { GlassCard } from "@/shared/ui/glass-card";
import { cn } from "@/shared/utils/cn";
import type { StudyStats } from "@/features/study-tracker/types";

interface StudyStatsProps {
  stats: StudyStats;
}

interface StatItemProps {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  accent?: "blue" | "green" | "purple" | "orange";
}

function StatItem({ label, value, sub, icon, accent = "blue" }: StatItemProps) {
  return (
    <GlassCard variant="elevated" padding="md" className="flex items-start gap-4">
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
          accent === "blue" && "bg-blue-500/15 text-blue-500",
          accent === "green" && "bg-green-500/15 text-green-500",
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

export function StudyStats({ stats }: StudyStatsProps): React.ReactElement {
  const { totalHoursThisWeek, totalMinutesThisWeek, totalSessions, averageDurationMinutes } = stats;

  const hoursDisplay =
    totalMinutesThisWeek < 60
      ? `${totalMinutesThisWeek}m`
      : `${totalHoursThisWeek}h`;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatItem
        label="This Week"
        value={hoursDisplay}
        sub="Total study time"
        icon={<Clock size={20} />}
        accent="blue"
      />
      <StatItem
        label="Total Sessions"
        value={String(totalSessions)}
        sub="All time"
        icon={<BookOpen size={20} />}
        accent="green"
      />
      <StatItem
        label="Avg Session"
        value={`${averageDurationMinutes}m`}
        sub="Per session"
        icon={<TrendingUp size={20} />}
        accent="purple"
      />
      <StatItem
        label="Subjects"
        value={String(stats.subjectBreakdown.length)}
        sub="Unique subjects"
        icon={<BarChart2 size={20} />}
        accent="orange"
      />
    </div>
  );
}
