"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants";
import type { TestSeriesData } from "@/features/test-series-tracker/types";

async function fetchTestSeriesData(): Promise<TestSeriesData> {
  const res = await fetch("/api/test-series");
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to fetch test series data");
  return json.data as TestSeriesData;
}

export function useTestSeries() {
  return useQuery({
    queryKey: [QUERY_KEYS.TEST_SERIES],
    queryFn: fetchTestSeriesData,
  });
}
