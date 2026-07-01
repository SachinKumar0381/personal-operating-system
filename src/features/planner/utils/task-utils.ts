import type { TaskPriority, TaskStatus } from "../types";

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: "text-green-500 bg-green-500/10 border-green-500/20",
  medium: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
  high: "text-red-500 bg-red-500/10 border-red-500/20",
};

export const STATUS_COLORS: Record<TaskStatus, string> = {
  todo: "text-muted-foreground bg-muted/30 border-border",
  in_progress: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  done: "text-green-500 bg-green-500/10 border-green-500/20",
};

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export function nextStatus(current: TaskStatus): TaskStatus {
  const cycle: TaskStatus[] = ["todo", "in_progress", "done"];
  const idx = cycle.indexOf(current);
  return cycle[(idx + 1) % cycle.length];
}
