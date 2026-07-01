"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants";
import type { SmokingEntry, SmokingStats } from "@/features/smoking-tracker/types";

interface SmokingData {
  entries: SmokingEntry[];
  stats: SmokingStats;
}

async function fetchSmokingData(): Promise<SmokingData> {
  const res = await fetch("/api/health/smoking");
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to fetch smoking data");
  return json.data as SmokingData;
}

export function useSmokingEntries() {
  return useQuery({
    queryKey: [QUERY_KEYS.SMOKING],
    queryFn: fetchSmokingData,
  });
}
