import { prisma } from "@/core/database";
import { NotFoundError, ForbiddenError } from "@/core/errors";
import { startOfWeek, endOfWeek } from "date-fns";
import type { CreateWorkoutInput } from "@/features/workout-tracker/schemas/workout-schema";
import type { WorkoutEntry, WorkoutExercise, WorkoutStats } from "@/features/workout-tracker/types";
import type { WorkoutEntry as PrismaWorkoutEntry, Prisma } from "@prisma/client";

function serialize(entry: PrismaWorkoutEntry): WorkoutEntry {
  return {
    id: entry.id,
    userId: entry.userId,
    name: entry.name,
    type: entry.type,
    duration: entry.duration,
    exercises: entry.exercises as unknown as WorkoutExercise[],
    notes: entry.notes ?? null,
    date: entry.date.toISOString(),
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
  };
}

export const workoutService = {
  async getWorkoutEntries(userId: string, limit = 20): Promise<WorkoutEntry[]> {
    const entries = await prisma.workoutEntry.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: limit,
    });
    return entries.map(serialize);
  },

  async getWorkoutStats(userId: string): Promise<WorkoutStats> {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

    const [weeklyEntries, totalEntries] = await Promise.all([
      prisma.workoutEntry.findMany({
        where: { userId, date: { gte: weekStart, lte: weekEnd } },
        select: { duration: true },
      }),
      prisma.workoutEntry.count({ where: { userId } }),
    ]);

    const minutesThisWeek = weeklyEntries.reduce((sum, e) => sum + e.duration, 0);

    return {
      totalThisWeek: weeklyEntries.length,
      minutesThisWeek,
      totalEntries,
    };
  },

  async createWorkoutEntry(userId: string, data: CreateWorkoutInput): Promise<WorkoutEntry> {
    const entry = await prisma.workoutEntry.create({
      data: {
        userId,
        name: data.name,
        type: data.type,
        duration: data.duration,
        exercises: data.exercises as Prisma.InputJsonValue[],
        notes: data.notes ?? null,
        date: new Date(data.date),
      },
    });
    return serialize(entry);
  },

  async deleteWorkoutEntry(userId: string, id: string): Promise<void> {
    const entry = await prisma.workoutEntry.findUnique({ where: { id } });
    if (!entry) throw new NotFoundError("Workout entry");
    if (entry.userId !== userId) throw new ForbiddenError();
    await prisma.workoutEntry.delete({ where: { id } });
  },
};
