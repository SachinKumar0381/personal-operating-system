"use client";

import { Flame, Beef, Wheat, Droplets, UtensilsCrossed } from "lucide-react";
import { GlassCard } from "@/shared/ui/glass-card";
import { cn } from "@/shared/utils/cn";
import type { MealStats } from "@/features/meal-planner/types";

interface MealStatsProps {
  stats: MealStats;
}

interface StatItemProps {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  accent?: "default" | "orange" | "red" | "yellow" | "blue" | "green";
}

function StatItem({ label, value, sub, icon, accent = "default" }: StatItemProps) {
  return (
    <GlassCard variant="elevated" padding="md" className="flex items-start gap-4">
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
          accent === "orange" && "bg-orange-500/15 text-orange-500",
          accent === "red" && "bg-red-500/15 text-red-500",
          accent === "yellow" && "bg-yellow-500/15 text-yellow-500",
          accent === "blue" && "bg-blue-500/15 text-blue-500",
          accent === "green" && "bg-green-500/15 text-green-500",
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

export function MealStats({ stats }: MealStatsProps): React.ReactElement {
  const { todayCalories, todayProtein, todayCarbs, todayFat, mealCount } = stats;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <StatItem
        label="Total Calories"
        value={`${todayCalories} kcal`}
        icon={<Flame size={20} />}
        sub="Today's intake"
        accent="orange"
      />
      <StatItem
        label="Protein"
        value={`${todayProtein}g`}
        icon={<Beef size={20} />}
        sub="Today"
        accent="red"
      />
      <StatItem
        label="Carbs"
        value={`${todayCarbs}g`}
        icon={<Wheat size={20} />}
        sub="Today"
        accent="yellow"
      />
      <StatItem
        label="Fat"
        value={`${todayFat}g`}
        icon={<Droplets size={20} />}
        sub="Today"
        accent="blue"
      />
      <StatItem
        label="Meals Logged"
        value={String(mealCount)}
        icon={<UtensilsCrossed size={20} />}
        sub="Today"
        accent="green"
      />
    </div>
  );
}
