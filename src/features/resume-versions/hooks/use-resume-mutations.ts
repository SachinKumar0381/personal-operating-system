"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/shared/constants";
import type { CreateResumeInput, UpdateResumeInput } from "@/features/resume-versions/schemas/resume-schema";

async function createVersion(data: CreateResumeInput) {
  const res = await fetch("/api/resume", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to create resume version");
  return json.data;
}

async function updateVersion({ id, data }: { id: string; data: UpdateResumeInput }) {
  const res = await fetch(`/api/resume/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to update resume version");
  return json.data;
}

async function deleteVersion(id: string) {
  const res = await fetch(`/api/resume/${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to delete resume version");
}

async function activateVersion(id: string) {
  const res = await fetch(`/api/resume/${id}/activate`, { method: "POST" });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to activate resume version");
  return json.data;
}

export function useResumeMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.RESUME] });

  const addVersion = useMutation({
    mutationFn: createVersion,
    onSuccess: () => {
      toast.success("Resume version added!");
      void invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const editVersion = useMutation({
    mutationFn: updateVersion,
    onSuccess: () => {
      toast.success("Resume version updated!");
      void invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const removeVersion = useMutation({
    mutationFn: deleteVersion,
    onSuccess: () => {
      toast.success("Resume version deleted");
      void invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const setActive = useMutation({
    mutationFn: activateVersion,
    onSuccess: () => {
      toast.success("Active resume updated!");
      void invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return { addVersion, editVersion, removeVersion, setActive };
}
