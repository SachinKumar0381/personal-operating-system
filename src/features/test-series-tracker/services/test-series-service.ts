import { prisma } from "@/core/database";
import { NotFoundError, ForbiddenError } from "@/core/errors";
import type { CreateTestSeriesInput, UpdateTestSeriesInput } from "@/features/test-series-tracker/schemas/test-series-schema";
import type { TestSeriesEntry, TestSeriesStats } from "@/features/test-series-tracker/types";
import type { TestSeriesEntry as PrismaEntry } from "@prisma/client";

function serialize(entry: PrismaEntry): TestSeriesEntry {
  return {
    id: entry.id,
    userId: entry.userId,
    module: entry.module,
    status: entry.status as TestSeriesEntry["status"],
    priority: entry.priority as TestSeriesEntry["priority"],
    notes: entry.notes ?? null,
    completedAt: entry.completedAt?.toISOString() ?? null,
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
  };
}

export const testSeriesService = {
  async getEntries(userId: string): Promise<TestSeriesEntry[]> {
    const entries = await prisma.testSeriesEntry.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });
    return entries.map(serialize);
  },

  async getStats(userId: string): Promise<TestSeriesStats> {
    const entries = await prisma.testSeriesEntry.findMany({ where: { userId } });
    const total = entries.length;
    const completed = entries.filter((e) => e.status === "completed").length;
    const inProgress = entries.filter((e) => e.status === "in_progress").length;
    const notStarted = entries.filter((e) => e.status === "not_started").length;
    const blocked = entries.filter((e) => e.status === "blocked").length;

    return {
      total,
      completed,
      inProgress,
      notStarted,
      blocked,
      completionPercentage: total === 0 ? 0 : Math.round((completed / total) * 100),
    };
  },

  async createEntry(userId: string, data: CreateTestSeriesInput): Promise<TestSeriesEntry> {
    const entry = await prisma.testSeriesEntry.create({
      data: {
        userId,
        module: data.module,
        status: data.status,
        priority: data.priority,
        notes: data.notes ?? null,
        completedAt: data.status === "completed" ? new Date() : null,
      },
    });
    return serialize(entry);
  },

  async updateEntry(
    userId: string,
    id: string,
    data: UpdateTestSeriesInput
  ): Promise<TestSeriesEntry> {
    const existing = await prisma.testSeriesEntry.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Test Series entry");
    if (existing.userId !== userId) throw new ForbiddenError();

    const entry = await prisma.testSeriesEntry.update({
      where: { id },
      data: {
        ...(data.module !== undefined && { module: data.module }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.priority !== undefined && { priority: data.priority }),
        ...(data.notes !== undefined && { notes: data.notes ?? null }),
        ...(data.status === "completed" && !existing.completedAt && { completedAt: new Date() }),
        ...(data.status !== undefined && data.status !== "completed" && { completedAt: null }),
      },
    });
    return serialize(entry);
  },

  async deleteEntry(userId: string, id: string): Promise<void> {
    const existing = await prisma.testSeriesEntry.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Test Series entry");
    if (existing.userId !== userId) throw new ForbiddenError();
    await prisma.testSeriesEntry.delete({ where: { id } });
  },
};
