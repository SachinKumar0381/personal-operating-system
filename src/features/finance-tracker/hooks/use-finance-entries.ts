"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants";
import type {
  FinanceEntry,
  FinanceStats,
  MonthlyTrend,
  CategoryBreakdown,
} from "@/features/finance-tracker/types";

export interface FinanceData {
  entries: FinanceEntry[];
  stats: FinanceStats;
  monthlyTrend: MonthlyTrend[];
  categoryBreakdown: CategoryBreakdown[];
}

async function fetchFinanceData(): Promise<FinanceData> {
  const res = await fetch("/api/finance");
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to fetch finance data");
  return json.data as FinanceData;
}

export function useFinanceEntries() {
  return useQuery({
    queryKey: [QUERY_KEYS.FINANCE],
    queryFn: fetchFinanceData,
  });
}
