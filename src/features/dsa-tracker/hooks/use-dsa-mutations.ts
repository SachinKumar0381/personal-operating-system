"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/shared/constants";
import type { CreateDsaInput, UpdateDsaInput } from "@/features/dsa-tracker/schemas/dsa-schema";

async function createProblem(data: CreateDsaInput) {
  const res = await fetch("/api/dsa", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to add problem");
  return json.data;
}

async function updateProblem({ id, data }: { id: string; data: UpdateDsaInput }) {
  const res = await fetch(`/api/dsa/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to update problem");
  return json.data;
}

async function deleteProblem(id: string) {
  const res = await fetch(`/api/dsa/${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to delete problem");
}

export function useDsaMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DSA] });

  const addProblem = useMutation({
    mutationFn: createProblem,
    onSuccess: () => {
      toast.success("Problem added!");
      void invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const editProblem = useMutation({
    mutationFn: updateProblem,
    onSuccess: () => {
      toast.success("Problem updated!");
      void invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const removeProblem = useMutation({
    mutationFn: deleteProblem,
    onSuccess: () => {
      toast.success("Problem removed");
      void invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return { addProblem, editProblem, removeProblem };
}
