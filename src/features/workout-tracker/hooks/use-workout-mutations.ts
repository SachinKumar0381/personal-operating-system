import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/shared/constants";
import type { CreateWorkoutInput } from "@/features/workout-tracker/schemas/workout-schema";

async function createWorkoutFn(data: CreateWorkoutInput): Promise<void> {
  const res = await fetch("/api/health/workout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create workout");
}

async function deleteWorkoutFn(id: string): Promise<void> {
  const res = await fetch(`/api/health/workout/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete workout");
}

export function useWorkoutMutations() {
  const queryClient = useQueryClient();

  function invalidate(): void {
    void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORKOUT] });
  }

  const createWorkout = useMutation({
    mutationFn: createWorkoutFn,
    onSuccess: () => {
      toast.success("Workout logged!");
      invalidate();
    },
    onError: () => toast.error("Failed to log workout"),
  });

  const deleteWorkout = useMutation({
    mutationFn: deleteWorkoutFn,
    onSuccess: () => {
      toast.success("Workout deleted");
      invalidate();
    },
    onError: () => toast.error("Failed to delete workout"),
  });

  return { createWorkout, deleteWorkout };
}
