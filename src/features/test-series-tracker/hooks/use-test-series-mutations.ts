"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/shared/constants";
import type {
  CreateTestSeriesInput,
  UpdateTestSeriesInput,
} from "@/features/test-series-tracker/schemas/test-series-schema";

async function createEntry(data: CreateTestSeriesInput) {
  const res = await fetch("/api/test-series", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to add module");
  return json.data;
}

async function updateEntry({ id, data }: { id: string; data: UpdateTestSeriesInput }) {
  const res = await fetch(`/api/test-series/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to update module");
  return json.data;
}

async function deleteEntry(id: string) {
  const res = await fetch(`/api/test-series/${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to delete module");
}

export function useTestSeriesMutations() {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TEST_SERIES] });

  const createModule = useMutation({
    mutationFn: createEntry,
    onSuccess: () => {
      toast.success("Module added!");
      void invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateModule = useMutation({
    mutationFn: updateEntry,
    onSuccess: () => {
      toast.success("Module updated!");
      void invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteModule = useMutation({
    mutationFn: deleteEntry,
    onSuccess: () => {
      toast.success("Module deleted");
      void invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return { createModule, updateModule, deleteModule };
}
