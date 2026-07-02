"use client";

import {
  BookOpen,
  Dumbbell,
  Moon,
  Scale,
  CheckSquare,
  Cigarette,
  TrendingUp,
} from "lucide-react";
import { GlassCard } from "@/shared/ui/glass-card";
import { ReportStatCard } from "./report-stat-card";
import type { MonthlySummary } from "@/features/reports/types";
import { format } from "date-fns";

interface MonthlySummaryProps {
  data: MonthlySummary;
}

function fmt(n: number | null, suffix = ""): string {
  if (n === null) return "—";
  return `${n}${suffix}`;
}

function fmtCurrency(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function MonthlySummarySection({ data }: MonthlySummaryProps): React.ReactElement {
  const completionPct =
    data.taskTotal > 0 ? Math.round((data.tasksCompleted / data.taskTotal) * 100) : 0;

  const weightChangeText =
    data.weightChange === null
      ? "—"
      : data.weightChange > 0
        ? `+${data.weightChange} kg`
        : `${data.weightChange} kg`;

  const monthLabel = format(new Date(), "MMMM yyyy");

  return (
    <GlassCard variant="default" padding="lg">
      <h2 className="mb-1 text-base font-semibold">{monthLabel}</h2>
      <p className="mb-5 text-xs text-muted-foreground">
        Month-to-date summary
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <ReportStatCard
          label="Study Hours"
          value={fmt(data.studyHours, " hrs")}
          icon={<BookOpen size={18} />}
          accent="blue"
        />
        <ReportStatCard
          label="Workouts"
          value={fmt(data.workoutsCompleted)}
          sub="sessions this month"
          icon={<Dumbbell size={18} />}
          accent="purple"
        />
        <ReportStatCard
          label="Avg Sleep"
          value={fmt(data.avgSleepHours, " hrs")}
          sub="per night"
          icon={<Moon size={18} />}
          accent="yellow"
        />
        <ReportStatCard
          label="Weight Change"
          value={weightChangeText}
          sub="vs previous entry"
          icon={<Scale size={18} />}
          accent={
            data.weightChange === null
              ? "blue"
              : data.weightChange <= 0
                ? "green"
                : "red"
          }
        />
        <ReportStatCard
          label="Tasks Done"
          value={`${data.tasksCompleted} / ${data.taskTotal}`}
          sub={`${completionPct}% completion`}
          icon={<CheckSquare size={18} />}
          accent="green"
        />
        <ReportStatCard
          label="Smoking"
          value={fmt(data.smokingAvgPerDay, "/day")}
          sub="avg cigarettes"
          icon={<Cigarette size={18} />}
          accent={
            data.smokingAvgPerDay === null
              ? "blue"
              : data.smokingAvgPerDay === 0
                ? "green"
                : "red"
          }
        />
        <ReportStatCard
          label="Income"
          value={fmtCurrency(data.financeIncome)}
          icon={<TrendingUp size={18} />}
          accent="green"
        />
        <ReportStatCard
          label="Expenses"
          value={fmtCurrency(data.financeExpenses)}
          icon={<TrendingUp size={18} className="rotate-180" />}
          accent="red"
        />
      </div>
    </GlassCard>
  );
}
