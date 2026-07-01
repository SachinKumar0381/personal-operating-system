import { prisma } from "@/core/database";
import { NotFoundError, ForbiddenError } from "@/core/errors";
import type { CreateSmokingInput } from "@/features/smoking-tracker/schemas/smoking-schema";
import type { SmokingEntry, SmokingStats } from "@/features/smoking-tracker/types";
import type { SmokingEntry as PrismaSmokingEntry } from "@prisma/client";
import { subDays, startOfDay, startOfWeek, isSameDay, format } from "date-fns";

function serialize(entry: PrismaSmokingEntry): SmokingEntry {
  return {
    id: entry.id,
    userId: entry.userId,
    cigarettesSmoked: entry.cigarettesSmoked,
    cravings: entry.cravings,
    mood: entry.mood ?? null,
    trigger: entry.trigger ?? null,
    notes: entry.notes ?? null,
    date: entry.date.toISOString(),
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
  };
}

function calcStreaks(entries: PrismaSmokingEntry[]): { current: number; longest: number } {
  if (entries.length === 0) return { current: 0, longest: 0 };

  // Build a map: dateKey → total cigarettes that day
  const dailyCount = new Map<string, number>();
  for (const entry of entries) {
    const key = format(entry.date, "yyyy-MM-dd");
    dailyCount.set(key, (dailyCount.get(key) ?? 0) + entry.cigarettesSmoked);
  }

  // Determine current streak: consecutive smoke-free days going back from today
  let current = 0;
  let day = 0;
  while (true) {
    const key = format(subDays(new Date(), day), "yyyy-MM-dd");
    const count = dailyCount.get(key);
    // If no entry for today, skip it (don't break streak)
    if (count === undefined) {
      if (day === 0) {
        day++;
        continue;
      }
      break;
    }
    if (count === 0) {
      current++;
      day++;
    } else {
      break;
    }
  }

  // Determine longest streak
  const sortedDates = [...dailyCount.keys()].sort();
  let longest = 0;
  let streak = 0;
  for (const key of sortedDates) {
    if ((dailyCount.get(key) ?? 0) === 0) {
      streak++;
      if (streak > longest) longest = streak;
    } else {
      streak = 0;
    }
  }

  return { current, longest };
}

export const smokingService = {
  async getSmokingEntries(userId: string, limit = 30): Promise<SmokingEntry[]> {
    const entries = await prisma.smokingEntry.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: limit,
    });
    return entries.map(serialize);
  },

  async getSmokingStats(userId: string): Promise<SmokingStats> {
    const allEntries = await prisma.smokingEntry.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    const totalEntries = allEntries.length;

    if (totalEntries === 0) {
      return {
        totalEntries: 0,
        currentStreak: 0,
        longestStreak: 0,
        cravingsResisted: 0,
        avgCigarettesToday: null,
        avgCigarettesThisWeek: null,
        smokeFreeToday: false,
      };
    }

    const today = startOfDay(new Date());
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

    const todayEntries = allEntries.filter((e) => isSameDay(e.date, today));
    const weekEntries = allEntries.filter((e) => e.date >= weekStart);

    const cravingsResisted = weekEntries.reduce((sum, e) => sum + e.cravings, 0);

    const avgCigarettesToday =
      todayEntries.length > 0
        ? todayEntries.reduce((sum, e) => sum + e.cigarettesSmoked, 0)
        : null;

    const weekDays = 7;
    const avgCigarettesThisWeek =
      weekEntries.length > 0
        ? Math.round(
            (weekEntries.reduce((sum, e) => sum + e.cigarettesSmoked, 0) / weekDays) * 10
          ) / 10
        : null;

    const smokeFreeToday =
      todayEntries.length > 0 &&
      todayEntries.every((e) => e.cigarettesSmoked === 0);

    const { current, longest } = calcStreaks(allEntries);

    return {
      totalEntries,
      currentStreak: current,
      longestStreak: longest,
      cravingsResisted,
      avgCigarettesToday,
      avgCigarettesThisWeek,
      smokeFreeToday,
    };
  },

  async createSmokingEntry(userId: string, data: CreateSmokingInput): Promise<SmokingEntry> {
    const entry = await prisma.smokingEntry.create({
      data: {
        userId,
        cigarettesSmoked: data.cigarettesSmoked,
        cravings: data.cravings,
        mood: data.mood ?? null,
        trigger: data.trigger ?? null,
        notes: data.notes ?? null,
        date: new Date(data.date),
      },
    });
    return serialize(entry);
  },

  async deleteSmokingEntry(userId: string, id: string): Promise<void> {
    const entry = await prisma.smokingEntry.findUnique({ where: { id } });
    if (!entry) throw new NotFoundError("Smoking entry");
    if (entry.userId !== userId) throw new ForbiddenError();
    await prisma.smokingEntry.delete({ where: { id } });
  },
};
