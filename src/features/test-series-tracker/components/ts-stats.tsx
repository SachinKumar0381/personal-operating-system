"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, Circle, AlertCircle, FlaskConical } from "lucide-react";
import { GlassCard } from "@/shared/ui/glass-card";
import { cn } from "@/shared/utils/cn";
import type { TestSeriesStats } from "@/features/test-series-tracker/types";

interface TsStatsProps {
  stats: TestSeriesStats;
}

const STAT_CARDS = [
  {
    key: "completed" as const,
    label: "Completed",
    icon: <CheckCircle2 size={16} />,
    colorClass: "text-green-500",
    bgClass: "bg-green-500/10",
  },
  {
    key: "inProgress" as const,
    label: "In Progress",
    icon: <Clock size={16} />,
    colorClass: "text-blue-500",
    bgClass: "bg-blue-500/10",
  },
  {
    key: "notStarted" as const,
    label: "Not Started",
    icon: <Circle size={16} />,
    colorClass: "text-muted-foreground",
    bgClass: "bg-muted/30",
  },
  {
    key: "blocked" as const,
    label: "Blocked",
    icon: <AlertCircle size={16} />,
    colorClass: "text-red-500",
    bgClass: "bg-red-500/10",
  },
];

export function TsStats({ stats }: TsStatsProps): React.ReactElement {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STAT_CARDS.map(({ key, label, icon, colorClass, bgClass }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.2 }}
          >
            <GlassCard variant="elevated" padding="md" className="space-y-2">
              <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", bgClass)}>
                <span className={colorClass}>{icon}</span>
              </div>
              <p className="text-2xl font-semibold tabular-nums">{stats[key]}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <GlassCard variant="elevated" padding="md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FlaskConical size={15} className="text-primary" />
            <p className="text-sm font-medium">Overall Progress</p>
          </div>
          <span className="text-sm font-semibold tabular-nums text-primary">
            {stats.completionPercentage}%
          </span>
        </div>

        <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10 dark:bg-white/5">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-blue-400"
            initial={{ width: 0 }}
            animate={{ width: `${stats.completionPercentage}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          {stats.completed} of {stats.total} modules completed
        </p>
      </GlassCard>
    </div>
  );
}
