"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants";
import type { WeightEntry, WeightStats } from "@/features/weight-tracker/types";

interface WeightData {
  entries: WeightEntry[];
  stats: WeightStats;
}

async function fetchWeightData(): Promise<WeightData> {
  const res = await fetch("/api/health/weight");
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to fetch weight data");
  return json.data as WeightData;
}

export function useWeightEntries() {
  return useQuery({
    queryKey: [QUERY_KEYS.WEIGHT],
    queryFn: fetchWeightData,
  });
}
