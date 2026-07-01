"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants";
import type { SleepEntry, SleepStats } from "@/features/sleep-tracker/types";

interface SleepData {
  entries: SleepEntry[];
  stats: SleepStats;
}

async function fetchSleepData(): Promise<SleepData> {
  const res = await fetch("/api/health/sleep");
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to fetch sleep data");
  return json.data as SleepData;
}

export function useSleepEntries() {
  return useQuery({
    queryKey: [QUERY_KEYS.SLEEP],
    queryFn: fetchSleepData,
  });
}
