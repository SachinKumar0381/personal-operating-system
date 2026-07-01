"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants";
import type { JobApplication, JobStats } from "@/features/job-tracker/types";

interface JobsData {
  applications: JobApplication[];
  stats: JobStats;
}

async function fetchJobs(): Promise<JobsData> {
  const res = await fetch("/api/jobs");
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to fetch job applications");
  return json.data as JobsData;
}

export function useJobs() {
  return useQuery({
    queryKey: [QUERY_KEYS.JOBS],
    queryFn: fetchJobs,
  });
}
