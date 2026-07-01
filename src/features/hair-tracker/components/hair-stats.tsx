"use client";

import { Sparkles, Calendar, Package, Clock } from "lucide-react";
import { format } from "date-fns";
import { GlassCard } from "@/shared/ui/glass-card";
import { cn } from "@/shared/utils/cn";
import type { HairStats } from "@/features/hair-tracker/types";

interface HairStatsProps {
  stats: HairStats;
}

interface StatItemProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  sub?: string;
  accent?: "default" | "green" | "yellow" | "blue" | "purple" | "pink";
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
          accent === "pink" && "bg-pink-500/15 text-pink-500",
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

export function HairStats({ stats }: HairStatsProps): React.ReactElement {
  const { totalEntries, entriesThisMonth, mostUsedProduct, lastEntryDate } = stats;

  const lastDate = lastEntryDate
    ? format(new Date(lastEntryDate), "d MMM yyyy")
    : "—";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatItem
        label="Total Logs"
        value={String(totalEntries)}
        icon={<Sparkles size={20} />}
        sub="All time"
        accent="pink"
      />
      <StatItem
        label="This Month"
        value={String(entriesThisMonth)}
        icon={<Calendar size={20} />}
        sub="Care sessions"
        accent="purple"
      />
      <StatItem
        label="Top Product"
        value={mostUsedProduct ?? "—"}
        icon={<Package size={20} />}
        sub="Most used"
        accent="blue"
      />
      <StatItem
        label="Last Entry"
        value={lastDate}
        icon={<Clock size={20} />}
        sub="Most recent log"
        accent="green"
      />
    </div>
  );
}
