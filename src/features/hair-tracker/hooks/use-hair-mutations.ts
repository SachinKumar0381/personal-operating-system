"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/shared/constants";
import type { CreateHairInput } from "@/features/hair-tracker/schemas/hair-schema";

async function postHairEntry(data: CreateHairInput): Promise<void> {
  const res = await fetch("/api/health/hair", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to log hair entry");
}

async function deleteHairEntry(id: string): Promise<void> {
  const res = await fetch(`/api/health/hair/${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to delete hair entry");
}

export function useHairMutations() {
  const queryClient = useQueryClient();

  const createHair = useMutation({
    mutationFn: postHairEntry,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.HAIR] });
      toast.success("Hair entry logged!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteHair = useMutation({
    mutationFn: deleteHairEntry,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.HAIR] });
      toast.success("Hair entry deleted.");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return { createHair, deleteHair };
}
