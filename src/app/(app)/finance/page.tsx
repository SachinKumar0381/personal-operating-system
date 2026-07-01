"use client";

import { Skeleton } from "@/shared/ui/skeleton";
import { useFinanceEntries } from "@/features/finance-tracker/hooks/use-finance-entries";
import { useFinanceMutations } from "@/features/finance-tracker/hooks/use-finance-mutations";
import { FinanceSummary } from "@/features/finance-tracker/components/finance-summary";
import { FinanceTrendChart } from "@/features/finance-tracker/components/finance-trend-chart";
import { FinanceCategoryChart } from "@/features/finance-tracker/components/finance-category-chart";
import { FinanceForm } from "@/features/finance-tracker/components/finance-form";
import { FinanceList } from "@/features/finance-tracker/components/finance-list";
import type { CreateFinanceInput } from "@/features/finance-tracker/schemas/finance-schema";
import type { FinanceStats, MonthlyTrend } from "@/features/finance-tracker/types";

const DEFAULT_STATS: FinanceStats = {
  thisMonthIncome: 0,
  thisMonthExpenses: 0,
  thisMonthSavings: 0,
  totalIncome: 0,
  totalExpenses: 0,
  netSavings: 0,
};

const EMPTY_TREND: MonthlyTrend[] = [];

export default function FinancePage(): React.ReactElement {
  const { data, isLoading } = useFinanceEntries();
  const { createFinance, deleteFinance } = useFinanceMutations();

  function handleCreate(input: CreateFinanceInput): void {
    createFinance.mutate(input);
  }

  function handleDelete(id: string): void {
    deleteFinance.mutate(id);
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  const entries = data?.entries ?? [];
  const stats = data?.stats ?? DEFAULT_STATS;
  const monthlyTrend = data?.monthlyTrend ?? EMPTY_TREND;
  const categoryBreakdown = data?.categoryBreakdown ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Finance Tracker</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track your income, expenses, and savings.
        </p>
      </div>

      <FinanceSummary stats={stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <FinanceTrendChart data={monthlyTrend} />
        <FinanceCategoryChart data={categoryBreakdown} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <FinanceForm onSubmit={handleCreate} isLoading={createFinance.isPending} />
        <FinanceList
          entries={entries}
          onDelete={handleDelete}
          isDeleting={deleteFinance.isPending}
        />
      </div>
    </div>
  );
}
