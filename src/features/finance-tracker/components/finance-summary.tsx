"use client";

import { TrendingUp, TrendingDown, PiggyBank, Wallet } from "lucide-react";
import { GlassCard } from "@/shared/ui/glass-card";
import { cn } from "@/shared/utils/cn";
import type { FinanceStats } from "@/features/finance-tracker/types";

interface FinanceSummaryProps {
  stats: FinanceStats;
}

interface StatItemProps {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  accent: "green" | "red" | "blue" | "purple";
}

function formatAmount(amount: number, currency: string = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function StatItem({ label, value, sub, icon, accent }: StatItemProps): React.ReactElement {
  return (
    <GlassCard variant="elevated" padding="md" className="flex items-start gap-4">
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
          accent === "green" && "bg-green-500/15 text-green-500",
          accent === "red" && "bg-red-500/15 text-red-500",
          accent === "blue" && "bg-blue-500/15 text-blue-500",
          accent === "purple" && "bg-purple-500/15 text-purple-500"
        )}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-xl font-semibold tabular-nums">{value}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
      </div>
    </GlassCard>
  );
}

export function FinanceSummary({ stats }: FinanceSummaryProps): React.ReactElement {
  const netColor =
    stats.netSavings >= 0 ? "green" : "red";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatItem
        label="This Month Income"
        value={formatAmount(stats.thisMonthIncome)}
        sub="Current month earnings"
        icon={<TrendingUp size={20} />}
        accent="green"
      />
      <StatItem
        label="This Month Expenses"
        value={formatAmount(stats.thisMonthExpenses)}
        sub="Current month spending"
        icon={<TrendingDown size={20} />}
        accent="red"
      />
      <StatItem
        label="This Month Savings"
        value={formatAmount(stats.thisMonthSavings)}
        sub="Savings this month"
        icon={<PiggyBank size={20} />}
        accent="blue"
      />
      <StatItem
        label="Net Savings (All Time)"
        value={formatAmount(stats.netSavings)}
        sub="Total income minus expenses"
        icon={<Wallet size={20} />}
        accent={netColor}
      />
    </div>
  );
}
