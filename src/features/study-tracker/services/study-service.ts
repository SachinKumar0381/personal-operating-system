import { prisma } from "@/core/database";
import { NotFoundError, ForbiddenError } from "@/core/errors";
import type { CreateStudyInput } from "@/features/study-tracker/schemas/study-schema";
import type { StudyEntry, StudyStats, DailyStudyPoint, SubjectStat } from "@/features/study-tracker/types";
import type { StudyEntry as PrismaStudyEntry } from "@prisma/client";
import { startOfWeek, endOfWeek, format, subDays } from "date-fns";

function serialize(entry: PrismaStudyEntry): StudyEntry {
  return {
    id: entry.id,
    userId: entry.userId,
    subject: entry.subject,
    topic: entry.topic,
    duration: entry.duration,
    notes: entry.notes ?? null,
    resources: entry.resources,
    date: entry.date.toISOString(),
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
  };
}

export const studyService = {
  async getStudyEntries(userId: string, limit = 50): Promise<StudyEntry[]> {
    const entries = await prisma.studyEntry.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: limit,
    });
    return entries.map(serialize);
  },

  async getStudyStats(userId: string): Promise<StudyStats> {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

    const [weekEntries, allEntries] = await Promise.all([
      prisma.studyEntry.findMany({
        where: { userId, date: { gte: weekStart, lte: weekEnd } },
      }),
      prisma.studyEntry.findMany({ where: { userId } }),
    ]);

    const totalMinutesThisWeek = weekEntries.reduce((sum, e) => sum + e.duration, 0);
    const totalSessions = allEntries.length;
    const totalMinutesAll = allEntries.reduce((sum, e) => sum + e.duration, 0);

    const subjectMap = new Map<string, SubjectStat>();
    for (const entry of allEntries) {
      const existing = subjectMap.get(entry.subject);
      if (existing) {
        existing.totalMinutes += entry.duration;
        existing.sessions += 1;
      } else {
        subjectMap.set(entry.subject, {
          subject: entry.subject,
          totalMinutes: entry.duration,
          sessions: 1,
        });
      }
    }

    const subjectBreakdown = Array.from(subjectMap.values()).sort(
      (a, b) => b.totalMinutes - a.totalMinutes
    );

    return {
      totalMinutesThisWeek,
      totalHoursThisWeek: +(totalMinutesThisWeek / 60).toFixed(1),
      totalSessions,
      averageDurationMinutes:
        totalSessions > 0 ? Math.round(totalMinutesAll / totalSessions) : 0,
      subjectBreakdown,
    };
  },

  async getDailyStudyPoints(userId: string, days = 14): Promise<DailyStudyPoint[]> {
    const since = subDays(new Date(), days - 1);
    since.setHours(0, 0, 0, 0);

    const entries = await prisma.studyEntry.findMany({
      where: { userId, date: { gte: since } },
      orderBy: { date: "asc" },
    });

    const dayMap = new Map<string, number>();
    for (let i = 0; i < days; i++) {
      const d = subDays(new Date(), days - 1 - i);
      dayMap.set(format(d, "yyyy-MM-dd"), 0);
    }

    for (const entry of entries) {
      const key = format(new Date(entry.date), "yyyy-MM-dd");
      dayMap.set(key, (dayMap.get(key) ?? 0) + entry.duration);
    }

    return Array.from(dayMap.entries()).map(([date, minutes]) => ({
      date: format(new Date(date), "d MMM"),
      minutes,
      hours: +(minutes / 60).toFixed(1),
    }));
  },

  async createStudyEntry(userId: string, data: CreateStudyInput): Promise<StudyEntry> {
    const resources = data.resources
      ? data.resources
          .split(",")
          .map((r) => r.trim())
          .filter(Boolean)
      : [];

    const entry = await prisma.studyEntry.create({
      data: {
        userId,
        subject: data.subject,
        topic: data.topic,
        duration: data.duration,
        notes: data.notes ?? null,
        resources,
        date: new Date(data.date),
      },
    });
    return serialize(entry);
  },

  async deleteStudyEntry(userId: string, id: string): Promise<void> {
    const entry = await prisma.studyEntry.findUnique({ where: { id } });
    if (!entry) throw new NotFoundError("Study entry");
    if (entry.userId !== userId) throw new ForbiddenError();
    await prisma.studyEntry.delete({ where: { id } });
  },
};
