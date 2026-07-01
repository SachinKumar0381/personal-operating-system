"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants";
import type { StudyEntry, StudyStats, DailyStudyPoint } from "@/features/study-tracker/types";

interface StudyData {
  entries: StudyEntry[];
  stats: StudyStats;
  dailyPoints: DailyStudyPoint[];
}

async function fetchStudyData(): Promise<StudyData> {
  const res = await fetch("/api/study");
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to fetch study data");
  return json.data as StudyData;
}

export function useStudyEntries() {
  return useQuery({
    queryKey: [QUERY_KEYS.STUDY],
    queryFn: fetchStudyData,
  });
}
