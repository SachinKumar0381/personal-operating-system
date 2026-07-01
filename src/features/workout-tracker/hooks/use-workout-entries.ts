import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants";
import type { WorkoutEntry, WorkoutStats } from "@/features/workout-tracker/types";

interface WorkoutData {
  entries: WorkoutEntry[];
  stats: WorkoutStats;
}

async function fetchWorkoutData(): Promise<WorkoutData> {
  const res = await fetch("/api/health/workout");
  if (!res.ok) throw new Error("Failed to fetch workout data");
  const json = await res.json();
  return json.data as WorkoutData;
}

export function useWorkoutEntries() {
  return useQuery({
    queryKey: [QUERY_KEYS.WORKOUT],
    queryFn: fetchWorkoutData,
  });
}
