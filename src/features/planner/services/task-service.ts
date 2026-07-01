import { prisma } from "@/core/database";
import { NotFoundError, ForbiddenError } from "@/core/errors";
import { startOfDay, endOfDay } from "date-fns";
import type { CreateTaskInput, UpdateTaskInput } from "../schemas/task-schema";
import type { Task } from "../types";

function serializeTask(task: {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  category: string | null;
  priority: string;
  status: string;
  date: Date;
  startTime: string | null;
  endTime: string | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}): Task {
  return {
    ...task,
    priority: task.priority as Task["priority"],
    status: task.status as Task["status"],
    date: task.date.toISOString(),
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}

export const taskService = {
  async getTasksByDate(userId: string, date: string): Promise<Task[]> {
    const d = new Date(date);
    const tasks = await prisma.plannerTask.findMany({
      where: {
        userId,
        date: { gte: startOfDay(d), lte: endOfDay(d) },
      },
      orderBy: [{ priority: "desc" }, { createdAt: "asc" }],
    });
    return tasks.map(serializeTask);
  },

  async createTask(userId: string, data: CreateTaskInput): Promise<Task> {
    const task = await prisma.plannerTask.create({
      data: {
        userId,
        title: data.title,
        description: data.description ?? null,
        category: data.category ?? null,
        priority: data.priority,
        status: data.status,
        date: new Date(data.date),
        startTime: data.startTime ?? null,
        endTime: data.endTime ?? null,
        tags: data.tags,
      },
    });
    return serializeTask(task);
  },

  async updateTask(userId: string, taskId: string, data: UpdateTaskInput): Promise<Task> {
    const existing = await prisma.plannerTask.findUnique({ where: { id: taskId } });
    if (!existing) throw new NotFoundError("Task");
    if (existing.userId !== userId) throw new ForbiddenError();

    const task = await prisma.plannerTask.update({
      where: { id: taskId },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description ?? null }),
        ...(data.category !== undefined && { category: data.category ?? null }),
        ...(data.priority !== undefined && { priority: data.priority }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.date !== undefined && { date: new Date(data.date) }),
        ...(data.startTime !== undefined && { startTime: data.startTime ?? null }),
        ...(data.endTime !== undefined && { endTime: data.endTime ?? null }),
        ...(data.tags !== undefined && { tags: data.tags }),
      },
    });
    return serializeTask(task);
  },

  async deleteTask(userId: string, taskId: string): Promise<void> {
    const existing = await prisma.plannerTask.findUnique({ where: { id: taskId } });
    if (!existing) throw new NotFoundError("Task");
    if (existing.userId !== userId) throw new ForbiddenError();
    await prisma.plannerTask.delete({ where: { id: taskId } });
  },
};
