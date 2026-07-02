"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, TrendingDown, PiggyBank, Wallet } from "lucide-react";
import { GlassCard } from "@/shared/ui/glass-card";
import { ReportStatCard } from "./report-stat-card";
import type { FinanceReport } from "@/features/reports/types";

interface FinanceReportProps {
  data: FinanceReport;
}

function fmtCurrency(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

const CATEGORY_COLORS = [
  "hsl(0 84% 60%)",
  "hsl(38 92% 50%)",
  "hsl(262 83% 60%)",
  "hsl(142 76% 45%)",
  "hsl(199 89% 48%)",
  "hsl(330 81% 60%)",
];

interface BarTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}

function BarTooltip({ active, payload, label }: BarTooltipProps): React.ReactElement | null {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/20 bg-white/80 px-3 py-2 text-xs shadow-lg backdrop-blur-sm dark:bg-black/60 dark:border-white/10 space-y-1">
      <p className="font-medium">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name.charAt(0).toUpperCase() + p.name.slice(1)}: {fmtCurrency(p.value)}
        </p>
      ))}
    </div>
  );
}

interface PieTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { percentage: number } }>;
}

function PieTooltip({ active, payload }: PieTooltipProps): React.ReactElement | null {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="rounded-xl border border-white/20 bg-white/80 px-3 py-2 text-xs shadow-lg backdrop-blur-sm dark:bg-black/60 dark:border-white/10">
      <p className="font-medium capitalize">{item?.name}</p>
      <p>{fmtCurrency(item?.value ?? 0)}</p>
      <p className="text-muted-foreground">{item?.payload?.percentage}% of expenses</p>
    </div>
  );
}

const hasTrendData = (data: FinanceReport) =>
  data.monthlyTrend.some((d) => d.income > 0 || d.expenses > 0 || d.savings > 0);

const hasCategoryData = (data: FinanceReport) => data.topExpenseCategories.length > 0;

export function FinanceReportSection({ data }: FinanceReportProps): React.ReactElement {
  const netSign = data.netSavings >= 0 ? "+" : "";

  return (
    <GlassCard variant="default" padding="lg">
      <h2 className="mb-1 text-base font-semibold">Finance Report</h2>
      <p className="mb-5 text-xs text-muted-foreground">
        Income vs expenses, savings, and top spending categories (last 6 months)
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-6">
        <ReportStatCard
          label="This Month Income"
          value={fmtCurrency(data.thisMonthIncome)}
          icon={<TrendingUp size={18} />}
          accent="green"
        />
        <ReportStatCard
          label="This Month Expenses"
          value={fmtCurrency(data.thisMonthExpenses)}
          icon={<TrendingDown size={18} />}
          accent="red"
        />
        <ReportStatCard
          label="This Month Savings"
          value={fmtCurrency(data.thisMonthSavings)}
          icon={<PiggyBank size={18} />}
          accent="blue"
        />
        <ReportStatCard
          label="Net Savings"
          value={`${netSign}${fmtCurrency(data.netSavings)}`}
          sub="all time (6 mo)"
          icon={<Wallet size={18} />}
          accent={data.netSavings >= 0 ? "green" : "red"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-sm font-medium">Monthly Trend (Last 6 Months)</p>
          {hasTrendData(data) ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={data.monthlyTrend}
                margin={{ top: 4, right: 8, bottom: 4, left: -8 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="currentColor"
                  strokeOpacity={0.08}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: "currentColor", opacity: 0.5 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "currentColor", opacity: 0.5 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<BarTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 10, paddingTop: 8 }}
                  formatter={(v: string) => v.charAt(0).toUpperCase() + v.slice(1)}
                />
                <Bar
                  dataKey="income"
                  fill="hsl(142 76% 45%)"
                  fillOpacity={0.85}
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  dataKey="expenses"
                  fill="hsl(0 84% 60%)"
                  fillOpacity={0.85}
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  dataKey="savings"
                  fill="hsl(221 83% 53%)"
                  fillOpacity={0.85}
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Add transactions to see the monthly trend.
            </p>
          )}
        </div>

        <div>
          <p className="mb-3 text-sm font-medium">Top Expense Categories</p>
          {hasCategoryData(data) ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data.topExpenseCategories}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                >
                  {data.topExpenseCategories.map((entry, index) => (
                    <Cell
                      key={entry.category}
                      fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                      fillOpacity={0.85}
                    />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 10 }}
                  formatter={(v: string) => v}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Add expense transactions to see a category breakdown.
            </p>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
