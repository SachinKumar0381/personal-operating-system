"use client";

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants";
import type { ApiResponse } from "@/shared/types";
import type { Task } from "../types";

async function fetchTasks(date: string): Promise<Task[]> {
  const res = await fetch(`/api/planner?date=${encodeURIComponent(date)}`);
  const json: ApiResponse<Task[]> = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to fetch tasks");
  return json.data ?? [];
}

export function useTasks(date: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.PLANNER, date],
    queryFn: () => fetchTasks(date),
    enabled: !!date,
  });
}
