"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/shared/constants";
import type { CreateSmokingInput } from "@/features/smoking-tracker/schemas/smoking-schema";

async function postSmokingEntry(data: CreateSmokingInput): Promise<void> {
  const res = await fetch("/api/health/smoking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to log smoking entry");
}

async function deleteSmokingEntry(id: string): Promise<void> {
  const res = await fetch(`/api/health/smoking/${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to delete smoking entry");
}

export function useSmokingMutations() {
  const queryClient = useQueryClient();

  const createSmoking = useMutation({
    mutationFn: postSmokingEntry,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SMOKING] });
      toast.success("Smoking entry logged!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteSmoking = useMutation({
    mutationFn: deleteSmokingEntry,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SMOKING] });
      toast.success("Smoking entry deleted.");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return { createSmoking, deleteSmoking };
}
