"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/shared/constants";
import type { CreateStudyInput } from "@/features/study-tracker/schemas/study-schema";

async function createEntry(data: CreateStudyInput) {
  const res = await fetch("/api/study", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to log study session");
  return json.data;
}

async function deleteEntry(id: string) {
  const res = await fetch(`/api/study/${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to delete entry");
}

export function useStudyMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STUDY] });

  const createStudy = useMutation({
    mutationFn: createEntry,
    onSuccess: () => {
      toast.success("Study session logged!");
      void invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteStudy = useMutation({
    mutationFn: deleteEntry,
    onSuccess: () => {
      toast.success("Entry deleted");
      void invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return { createStudy, deleteStudy };
}
