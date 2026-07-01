"use client";

import { FileText, CheckCircle2, Layers } from "lucide-react";
import { GlassCard } from "@/shared/ui/glass-card";
import type { ResumeStats } from "@/features/resume-versions/types";

interface ResumeStatsProps {
  stats: ResumeStats;
}

export function ResumeStatsSection({ stats }: ResumeStatsProps): React.ReactElement {
  const items = [
    {
      label: "Total Versions",
      value: stats.total,
      icon: Layers,
      color: "text-blue-500",
    },
    {
      label: "Active Version",
      value: stats.activeVersion ?? "None",
      icon: CheckCircle2,
      color: "text-green-500",
    },
    {
      label: "Status",
      value: stats.hasActive ? "Active set" : "No active",
      icon: FileText,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {items.map(({ label, value, icon: Icon, color }) => (
        <GlassCard key={label} variant="elevated" padding="md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 dark:bg-white/5">
              <Icon size={18} className={color} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="truncate font-semibold">{value}</p>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
