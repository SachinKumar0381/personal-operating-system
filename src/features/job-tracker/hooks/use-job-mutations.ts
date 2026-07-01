"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/shared/constants";
import type {
  CreateJobInput,
  UpdateJobInput,
  CreateInterviewInput,
} from "@/features/job-tracker/schemas/job-schema";

async function createJob(data: CreateJobInput) {
  const res = await fetch("/api/jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to add application");
  return json.data;
}

async function updateJob({ id, data }: { id: string; data: UpdateJobInput }) {
  const res = await fetch(`/api/jobs/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to update application");
  return json.data;
}

async function deleteJob(id: string) {
  const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to delete application");
}

async function addInterviewRound({
  applicationId,
  data,
}: {
  applicationId: string;
  data: CreateInterviewInput;
}) {
  const res = await fetch(`/api/jobs/${applicationId}/rounds`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to add interview round");
  return json.data;
}

async function deleteInterviewRound({ roundId }: { roundId: string }) {
  const res = await fetch(`/api/jobs/rounds/${roundId}`, { method: "DELETE" });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to delete interview round");
}

export function useJobMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.JOBS] });

  const addJob = useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      toast.success("Application added!");
      void invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const editJob = useMutation({
    mutationFn: updateJob,
    onSuccess: () => {
      toast.success("Application updated!");
      void invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const removeJob = useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      toast.success("Application removed");
      void invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const addRound = useMutation({
    mutationFn: addInterviewRound,
    onSuccess: () => {
      toast.success("Interview round added!");
      void invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const removeRound = useMutation({
    mutationFn: deleteInterviewRound,
    onSuccess: () => {
      toast.success("Round removed");
      void invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return { addJob, editJob, removeJob, addRound, removeRound };
}
