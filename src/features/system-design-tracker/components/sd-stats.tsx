"use client";

import { CheckCircle2, Clock, BookOpen, RefreshCw, Target } from "lucide-react";
import { GlassCard } from "@/shared/ui/glass-card";
import { cn } from "@/shared/utils/cn";
import type { SdStats } from "@/features/system-design-tracker/types";

interface SdStatsProps {
  stats: SdStats;
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

export function SdStats({ stats }: SdStatsProps): React.ReactElement {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatItem
          label="Completed"
          value={String(stats.completed)}
          sub={`of ${stats.total} topics`}
          icon={<CheckCircle2 size={20} />}
          accent="green"
        />
        <StatItem
          label="In Progress"
          value={String(stats.inProgress)}
          sub={`${stats.notStarted} not started`}
          icon={<Clock size={20} />}
          accent="blue"
        />
        <StatItem
          label="Needs Revision"
          value={String(stats.needsRevision)}
          sub="Revisit these topics"
          icon={<RefreshCw size={20} />}
          accent="orange"
        />
        <StatItem
          label="Total Topics"
          value={String(stats.total)}
          sub={`${stats.completionPct}% complete`}
          icon={<BookOpen size={20} />}
          accent="purple"
        />
      </div>

      <GlassCard variant="elevated" padding="md">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-medium text-muted-foreground">
            <Target size={12} />
            Completion progress
          </span>
          <span className="font-semibold text-primary">
            {stats.completed} / {stats.total} completed
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10 dark:bg-white/5">
          <div
            className="h-full rounded-full bg-primary/80 transition-all duration-700"
            style={{ width: `${stats.completionPct}%` }}
          />
        </div>
        <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-green-500/70" />
            {stats.completed} done
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-blue-500/70" />
            {stats.inProgress} active
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-orange-500/70" />
            {stats.needsRevision} revision
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
            {stats.notStarted} not started
          </span>
        </div>
      </GlassCard>
    </div>
  );
}
