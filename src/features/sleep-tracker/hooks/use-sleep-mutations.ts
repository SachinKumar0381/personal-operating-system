"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/shared/constants";
import type { CreateSleepInput } from "@/features/sleep-tracker/schemas/sleep-schema";

async function postSleepEntry(data: CreateSleepInput): Promise<void> {
  const res = await fetch("/api/health/sleep", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to log sleep entry");
}

async function deleteSleepEntry(id: string): Promise<void> {
  const res = await fetch(`/api/health/sleep/${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to delete sleep entry");
}

export function useSleepMutations() {
  const queryClient = useQueryClient();

  const createSleep = useMutation({
    mutationFn: postSleepEntry,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SLEEP] });
      toast.success("Sleep entry logged!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteSleep = useMutation({
    mutationFn: deleteSleepEntry,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SLEEP] });
      toast.success("Sleep entry deleted.");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return { createSleep, deleteSleep };
}
