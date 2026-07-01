import type { TASK_CATEGORIES, TASK_PRIORITIES, TASK_STATUSES } from "../schemas/task-schema";

export type TaskCategory = (typeof TASK_CATEGORIES)[number];
export type TaskPriority = (typeof TASK_PRIORITIES)[number];
export type TaskStatus = (typeof TASK_STATUSES)[number];

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  category: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  date: string;
  startTime: string | null;
  endTime: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskFiltersState {
  category: TaskCategory | "all";
  priority: TaskPriority | "all";
  status: TaskStatus | "all";
}
