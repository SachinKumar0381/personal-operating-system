import { prisma } from "@/core/database";
import { NotFoundError, ForbiddenError } from "@/core/errors";
import type { CreateSleepInput } from "@/features/sleep-tracker/schemas/sleep-schema";
import type { SleepEntry, SleepStats } from "@/features/sleep-tracker/types";
import type { SleepEntry as PrismaSleepEntry } from "@prisma/client";
import { subDays, startOfDay } from "date-fns";

function serialize(entry: PrismaSleepEntry): SleepEntry {
  return {
    id: entry.id,
    userId: entry.userId,
    bedTime: entry.bedTime.toISOString(),
    wakeTime: entry.wakeTime.toISOString(),
    duration: entry.duration,
    quality: entry.quality,
    notes: entry.notes ?? null,
    date: entry.date.toISOString(),
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
  };
}

function calcDuration(bedTime: Date, wakeTime: Date): number {
  const diffMs = wakeTime.getTime() - bedTime.getTime();
  return Math.round((diffMs / (1000 * 60 * 60)) * 10) / 10;
}

export const sleepService = {
  async getSleepEntries(userId: string, limit = 30): Promise<SleepEntry[]> {
    const entries = await prisma.sleepEntry.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: limit,
    });
    return entries.map(serialize);
  },

  async getSleepStats(userId: string): Promise<SleepStats> {
    const allEntries = await prisma.sleepEntry.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    const totalEntries = allEntries.length;

    if (totalEntries === 0) {
      return {
        avgDuration: null,
        avgQuality: null,
        totalEntries: 0,
        lastNightDuration: null,
        lastNightQuality: null,
        weeklyEntries: [],
      };
    }

    const sevenDaysAgo = startOfDay(subDays(new Date(), 6));
    const weeklyEntries = allEntries.filter((e) => e.date >= sevenDaysAgo);

    const avgDuration =
      weeklyEntries.length > 0
        ? Math.round(
            (weeklyEntries.reduce((sum, e) => sum + e.duration, 0) / weeklyEntries.length) * 10
          ) / 10
        : null;

    const avgQuality =
      weeklyEntries.length > 0
        ? Math.round(
            (weeklyEntries.reduce((sum, e) => sum + e.quality, 0) / weeklyEntries.length) * 10
          ) / 10
        : null;

    const last = allEntries[0];

    return {
      avgDuration,
      avgQuality,
      totalEntries,
      lastNightDuration: last?.duration ?? null,
      lastNightQuality: last?.quality ?? null,
      weeklyEntries: weeklyEntries.map(serialize),
    };
  },

  async createSleepEntry(userId: string, data: CreateSleepInput): Promise<SleepEntry> {
    const bedTime = new Date(data.bedTime);
    const wakeTime = new Date(data.wakeTime);
    const duration = calcDuration(bedTime, wakeTime);

    const entry = await prisma.sleepEntry.create({
      data: {
        userId,
        bedTime,
        wakeTime,
        duration,
        quality: data.quality,
        notes: data.notes ?? null,
        date: new Date(data.date),
      },
    });
    return serialize(entry);
  },

  async deleteSleepEntry(userId: string, id: string): Promise<void> {
    const entry = await prisma.sleepEntry.findUnique({ where: { id } });
    if (!entry) throw new NotFoundError("Sleep entry");
    if (entry.userId !== userId) throw new ForbiddenError();
    await prisma.sleepEntry.delete({ where: { id } });
  },
};
