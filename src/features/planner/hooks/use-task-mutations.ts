"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/shared/constants";
import type { ApiResponse } from "@/shared/types";
import type { CreateTaskInput, UpdateTaskInput } from "../schemas/task-schema";
import type { Task } from "../types";

async function apiCreateTask(data: CreateTaskInput): Promise<Task> {
  const res = await fetch("/api/planner", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json: ApiResponse<Task> = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to create task");
  return json.data!;
}

async function apiUpdateTask(taskId: string, data: UpdateTaskInput): Promise<Task> {
  const res = await fetch(`/api/planner/${taskId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json: ApiResponse<Task> = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to update task");
  return json.data!;
}

async function apiDeleteTask(taskId: string): Promise<void> {
  const res = await fetch(`/api/planner/${taskId}`, { method: "DELETE" });
  const json: ApiResponse = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to delete task");
}

export function useTaskMutations(date: string) {
  const queryClient = useQueryClient();
  const key = [QUERY_KEYS.PLANNER, date];

  const createTask = useMutation({
    mutationFn: apiCreateTask,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: key });
      toast.success("Task created");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateTask = useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: UpdateTaskInput }) =>
      apiUpdateTask(taskId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: key });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteTask = useMutation({
    mutationFn: apiDeleteTask,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: key });
      toast.success("Task deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return { createTask, updateTask, deleteTask };
}
