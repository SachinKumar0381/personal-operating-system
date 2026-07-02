"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants";
import type { AllReports } from "@/features/reports/types";

async function fetchReports(): Promise<AllReports> {
  const res = await fetch("/api/reports");
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to fetch reports");
  return json.data as AllReports;
}

export function useReports() {
  return useQuery({
    queryKey: [QUERY_KEYS.REPORTS],
    queryFn: fetchReports,
    staleTime: 1000 * 60 * 5,
  });
}
