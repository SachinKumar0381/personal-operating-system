"use client";

import { GlassCard } from "@/shared/ui/glass-card";
import type { CategoryBreakdown } from "@/features/finance-tracker/types";

interface FinanceCategoryChartProps {
  data: CategoryBreakdown[];
}

export function FinanceCategoryChart({ data }: FinanceCategoryChartProps): React.ReactElement {
  const top = data.slice(0, 8);
  const maxAmount = top[0]?.amount ?? 1;

  if (top.length === 0) {
    return (
      <GlassCard variant="elevated" padding="md">
        <p className="mb-4 text-sm font-medium">Expense Breakdown by Category</p>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Add expense transactions to see the breakdown.
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard variant="elevated" padding="md">
      <p className="mb-4 text-sm font-medium">Expense Breakdown by Category</p>
      <div className="space-y-3">
        {top.map((item) => {
          const pct = Math.round((item.amount / maxAmount) * 100);
          return (
            <div key={item.category}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium">{item.category}</span>
                <span className="tabular-nums text-muted-foreground">
                  ₹{item.amount.toLocaleString("en-IN")}
                  <span className="ml-1 opacity-60">({item.count})</span>
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10 dark:bg-white/5">
                <div
                  className="h-full rounded-full bg-red-500/60 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
