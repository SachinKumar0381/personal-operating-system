"use client";

import { Briefcase, Activity, Trophy, XCircle } from "lucide-react";
import { GlassCard } from "@/shared/ui/glass-card";
import { cn } from "@/shared/utils/cn";
import type { JobStats } from "@/features/job-tracker/types";

interface JobStatsProps {
  stats: JobStats;
}

interface StatItemProps {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  accent?: "blue" | "green" | "yellow" | "red" | "purple";
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
          accent === "red" && "bg-red-500/15 text-red-500",
          accent === "purple" && "bg-purple-500/15 text-purple-500"
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

export function JobStats({ stats }: JobStatsProps): React.ReactElement {
  const rejectionRate =
    stats.total > 0 ? Math.round((stats.rejected / stats.total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatItem
        label="Total Applied"
        value={String(stats.total)}
        sub="all time"
        icon={<Briefcase size={20} />}
        accent="blue"
      />
      <StatItem
        label="Active Pipeline"
        value={String(stats.active)}
        sub="applied · screening · interview"
        icon={<Activity size={20} />}
        accent="yellow"
      />
      <StatItem
        label="Offers Received"
        value={String(stats.offers)}
        sub={stats.total > 0 ? `${Math.round((stats.offers / stats.total) * 100)}% offer rate` : "—"}
        icon={<Trophy size={20} />}
        accent="green"
      />
      <StatItem
        label="Rejection Rate"
        value={`${rejectionRate}%`}
        sub={`${stats.rejected} rejected`}
        icon={<XCircle size={20} />}
        accent="red"
      />
    </div>
  );
}
