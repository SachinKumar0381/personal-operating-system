"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/shared/constants";
import type { CreateSdInput, UpdateSdInput } from "@/features/system-design-tracker/schemas/sd-schema";

async function createTopic(data: CreateSdInput) {
  const res = await fetch("/api/system-design", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to add topic");
  return json.data;
}

async function updateTopic({ id, data }: { id: string; data: UpdateSdInput }) {
  const res = await fetch(`/api/system-design/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to update topic");
  return json.data;
}

async function deleteTopic(id: string) {
  const res = await fetch(`/api/system-design/${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to delete topic");
}

export function useSdMutations() {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SYSTEM_DESIGN] });

  const addTopic = useMutation({
    mutationFn: createTopic,
    onSuccess: () => {
      toast.success("Topic added!");
      void invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const editTopic = useMutation({
    mutationFn: updateTopic,
    onSuccess: () => {
      toast.success("Topic updated!");
      void invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const removeTopic = useMutation({
    mutationFn: deleteTopic,
    onSuccess: () => {
      toast.success("Topic removed");
      void invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return { addTopic, editTopic, removeTopic };
}
