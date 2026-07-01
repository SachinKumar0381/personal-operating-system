"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants";
import type { HairEntry, HairStats } from "@/features/hair-tracker/types";

interface HairData {
  entries: HairEntry[];
  stats: HairStats;
}

async function fetchHairData(): Promise<HairData> {
  const res = await fetch("/api/health/hair");
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to fetch hair data");
  return json.data as HairData;
}

export function useHairEntries() {
  return useQuery({
    queryKey: [QUERY_KEYS.HAIR],
    queryFn: fetchHairData,
  });
}
