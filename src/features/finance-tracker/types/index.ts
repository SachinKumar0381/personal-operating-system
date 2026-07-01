export type FinanceType = "income" | "expense" | "saving";

export interface FinanceEntry {
  id: string;
  userId: string;
  type: FinanceType;
  category: string;
  amount: number;
  currency: string;
  description: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinanceStats {
  thisMonthIncome: number;
  thisMonthExpenses: number;
  thisMonthSavings: number;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  count: number;
}
