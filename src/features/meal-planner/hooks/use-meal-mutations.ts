"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/shared/constants";
import type { CreateMealInput } from "@/features/meal-planner/schemas/meal-schema";

async function postMealEntry(data: CreateMealInput): Promise<void> {
  const res = await fetch("/api/health/meals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to log meal entry");
}

async function deleteMealEntry(id: string): Promise<void> {
  const res = await fetch(`/api/health/meals/${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to delete meal entry");
}

export function useMealMutations(date: string) {
  const queryClient = useQueryClient();

  const createMeal = useMutation({
    mutationFn: postMealEntry,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MEALS, date] });
      toast.success("Meal logged!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteMeal = useMutation({
    mutationFn: deleteMealEntry,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MEALS, date] });
      toast.success("Meal entry deleted.");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return { createMeal, deleteMeal };
}
