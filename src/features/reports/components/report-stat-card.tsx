"use client";

import { GlassCard } from "@/shared/ui/glass-card";
import { cn } from "@/shared/utils/cn";

interface ReportStatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  accent?: "blue" | "green" | "red" | "purple" | "orange" | "yellow";
}

const accentMap: Record<NonNullable<ReportStatCardProps["accent"]>, string> = {
  blue: "bg-blue-500/15 text-blue-500",
  green: "bg-green-500/15 text-green-500",
  red: "bg-red-500/15 text-red-500",
  purple: "bg-purple-500/15 text-purple-500",
  orange: "bg-orange-500/15 text-orange-500",
  yellow: "bg-yellow-500/15 text-yellow-500",
};

export function ReportStatCard({
  label,
  value,
  sub,
  icon,
  accent = "blue",
}: ReportStatCardProps): React.ReactElement {
  return (
    <GlassCard variant="elevated" padding="md" className="flex items-start gap-4">
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
          accentMap[accent]
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
