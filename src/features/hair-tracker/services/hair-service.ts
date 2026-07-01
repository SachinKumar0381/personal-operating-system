import { prisma } from "@/core/database";
import { NotFoundError, ForbiddenError } from "@/core/errors";
import type { CreateHairInput } from "@/features/hair-tracker/schemas/hair-schema";
import type { HairEntry, HairStats } from "@/features/hair-tracker/types";
import type { HairEntry as PrismaHairEntry } from "@prisma/client";
import { startOfMonth } from "date-fns";

function serialize(entry: PrismaHairEntry): HairEntry {
  return {
    id: entry.id,
    userId: entry.userId,
    type: entry.type,
    products: entry.products,
    notes: entry.notes ?? null,
    photos: entry.photos,
    date: entry.date.toISOString(),
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
  };
}

export const hairService = {
  async getHairEntries(userId: string, limit = 50): Promise<HairEntry[]> {
    const entries = await prisma.hairEntry.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: limit,
    });
    return entries.map(serialize);
  },

  async getHairStats(userId: string): Promise<HairStats> {
    const allEntries = await prisma.hairEntry.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    const totalEntries = allEntries.length;

    if (totalEntries === 0) {
      return {
        totalEntries: 0,
        entriesThisMonth: 0,
        mostUsedProduct: null,
        lastEntryDate: null,
        typeBreakdown: {},
      };
    }

    const monthStart = startOfMonth(new Date());
    const entriesThisMonth = allEntries.filter((e) => e.date >= monthStart).length;

    const typeBreakdown: Record<string, number> = {};
    const productCount: Record<string, number> = {};

    for (const entry of allEntries) {
      typeBreakdown[entry.type] = (typeBreakdown[entry.type] ?? 0) + 1;
      for (const product of entry.products) {
        productCount[product] = (productCount[product] ?? 0) + 1;
      }
    }

    const mostUsedProduct =
      Object.keys(productCount).length > 0
        ? Object.entries(productCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
        : null;

    return {
      totalEntries,
      entriesThisMonth,
      mostUsedProduct,
      lastEntryDate: allEntries[0]?.date.toISOString() ?? null,
      typeBreakdown,
    };
  },

  async createHairEntry(userId: string, data: CreateHairInput): Promise<HairEntry> {
    const photos = data.photoUrl ? [data.photoUrl] : [];

    const entry = await prisma.hairEntry.create({
      data: {
        userId,
        type: data.type,
        products: data.products ?? [],
        notes: data.notes ?? null,
        photos,
        date: new Date(data.date),
      },
    });
    return serialize(entry);
  },

  async deleteHairEntry(userId: string, id: string): Promise<void> {
    const entry = await prisma.hairEntry.findUnique({ where: { id } });
    if (!entry) throw new NotFoundError("Hair entry");
    if (entry.userId !== userId) throw new ForbiddenError();
    await prisma.hairEntry.delete({ where: { id } });
  },
};
