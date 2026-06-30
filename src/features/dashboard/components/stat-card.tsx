import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { GlassCard } from "@/shared/ui/glass-card";

interface Trend {
  value: number;
  direction: "up" | "down";
  label: string;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: Trend;
  iconWrapperClassName?: string;
  description?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  iconWrapperClassName = "text-primary bg-primary/10",
  description,
}: StatCardProps): React.ReactElement {
  return (
    <GlassCard variant="elevated" padding="md" className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-xl",
            iconWrapperClassName
          )}
        >
          <Icon size={15} />
        </div>
      </div>
      <div>
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {trend && (
        <div
          className={cn(
            "flex items-center gap-1 text-xs font-medium",
            trend.direction === "up" ? "text-emerald-500" : "text-red-500"
          )}
        >
          {trend.direction === "up" ? (
            <TrendingUp size={12} />
          ) : (
            <TrendingDown size={12} />
          )}
          <span>
            {trend.value > 0 ? "+" : ""}
            {trend.value}% {trend.label}
          </span>
        </div>
      )}
    </GlassCard>
  );
}
