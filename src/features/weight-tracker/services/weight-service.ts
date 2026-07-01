import { prisma } from "@/core/database";
import { NotFoundError, ForbiddenError } from "@/core/errors";
import type { CreateWeightInput } from "@/features/weight-tracker/schemas/weight-schema";
import type { WeightEntry, WeightStats } from "@/features/weight-tracker/types";
import type { WeightEntry as PrismaWeightEntry } from "@prisma/client";

function serialize(entry: PrismaWeightEntry): WeightEntry {
  return {
    id: entry.id,
    userId: entry.userId,
    weight: entry.weight,
    unit: entry.unit,
    notes: entry.notes ?? null,
    date: entry.date.toISOString(),
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
  };
}

export const weightService = {
  async getWeightEntries(userId: string, limit = 30): Promise<WeightEntry[]> {
    const entries = await prisma.weightEntry.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: limit,
    });
    return entries.map(serialize);
  },

  async getWeightStats(userId: string): Promise<WeightStats> {
    const entries = await prisma.weightEntry.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 2,
    });

    const totalEntries = await prisma.weightEntry.count({ where: { userId } });

    if (entries.length === 0) {
      return { currentWeight: null, previousWeight: null, change: null, unit: "kg", totalEntries: 0 };
    }

    const current = entries[0];
    const previous = entries[1] ?? null;
    const change = previous ? +(current.weight - previous.weight).toFixed(1) : null;

    return {
      currentWeight: current.weight,
      previousWeight: previous?.weight ?? null,
      change,
      unit: current.unit,
      totalEntries,
    };
  },

  async createWeightEntry(userId: string, data: CreateWeightInput): Promise<WeightEntry> {
    const entry = await prisma.weightEntry.create({
      data: {
        userId,
        weight: data.weight,
        unit: data.unit,
        notes: data.notes ?? null,
        date: new Date(data.date),
      },
    });
    return serialize(entry);
  },

  async deleteWeightEntry(userId: string, id: string): Promise<void> {
    const entry = await prisma.weightEntry.findUnique({ where: { id } });
    if (!entry) throw new NotFoundError("Weight entry");
    if (entry.userId !== userId) throw new ForbiddenError();
    await prisma.weightEntry.delete({ where: { id } });
  },
};
