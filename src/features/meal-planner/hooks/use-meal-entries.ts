"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { QUERY_KEYS } from "@/shared/constants";
import type { MealData } from "@/features/meal-planner/types";

async function fetchMealData(date: string): Promise<MealData> {
  const res = await fetch(`/api/health/meals?date=${date}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to fetch meal data");
  return json.data as MealData;
}

export function useMealEntries(date: string = format(new Date(), "yyyy-MM-dd")) {
  return useQuery({
    queryKey: [QUERY_KEYS.MEALS, date],
    queryFn: () => fetchMealData(date),
  });
}
