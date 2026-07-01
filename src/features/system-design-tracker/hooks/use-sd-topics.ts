"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants";
import type { SystemDesignTopic, SdStats } from "@/features/system-design-tracker/types";

interface SdData {
  topics: SystemDesignTopic[];
  stats: SdStats;
}

async function fetchSdData(): Promise<SdData> {
  const res = await fetch("/api/system-design");
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to fetch system design data");
  return json.data as SdData;
}

export function useSdTopics() {
  return useQuery({
    queryKey: [QUERY_KEYS.SYSTEM_DESIGN],
    queryFn: fetchSdData,
  });
}
