"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/shared/constants";
import type { CreateWeightInput } from "@/features/weight-tracker/schemas/weight-schema";

async function createEntry(data: CreateWeightInput) {
  const res = await fetch("/api/health/weight", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to log weight");
  return json.data;
}

async function deleteEntry(id: string) {
  const res = await fetch(`/api/health/weight/${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to delete entry");
}

export function useWeightMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WEIGHT] });

  const createWeight = useMutation({
    mutationFn: createEntry,
    onSuccess: () => {
      toast.success("Weight logged!");
      void invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteWeight = useMutation({
    mutationFn: deleteEntry,
    onSuccess: () => {
      toast.success("Entry deleted");
      void invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return { createWeight, deleteWeight };
}
