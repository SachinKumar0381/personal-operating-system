"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants";
import type { DsaProblem, DsaStats } from "@/features/dsa-tracker/types";

interface DsaData {
  problems: DsaProblem[];
  stats: DsaStats;
}

async function fetchDsaData(): Promise<DsaData> {
  const res = await fetch("/api/dsa");
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to fetch DSA data");
  return json.data as DsaData;
}

export function useDsaProblems() {
  return useQuery({
    queryKey: [QUERY_KEYS.DSA],
    queryFn: fetchDsaData,
  });
}
