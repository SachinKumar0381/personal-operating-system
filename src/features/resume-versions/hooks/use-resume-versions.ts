"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants";
import type { ResumeVersion, ResumeStats } from "@/features/resume-versions/types";

interface ResumeData {
  versions: ResumeVersion[];
  stats: ResumeStats;
}

async function fetchResumeVersions(): Promise<ResumeData> {
  const res = await fetch("/api/resume");
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to fetch resume versions");
  return json.data as ResumeData;
}

export function useResumeVersions() {
  return useQuery({
    queryKey: [QUERY_KEYS.RESUME],
    queryFn: fetchResumeVersions,
  });
}
