import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";
import { prisma } from "@/core/database";
import { NotFoundError, ForbiddenError } from "@/core/errors";
import type { CreateFinanceInput, UpdateFinanceInput } from "@/features/finance-tracker/schemas/finance-schema";
import type {
  FinanceEntry,
  FinanceStats,
  MonthlyTrend,
  CategoryBreakdown,
} from "@/features/finance-tracker/types";
import type { FinanceEntry as PrismaFinanceEntry } from "@prisma/client";

function serialize(entry: PrismaFinanceEntry): FinanceEntry {
  return {
    id: entry.id,
    userId: entry.userId,
    type: entry.type as FinanceEntry["type"],
    category: entry.category,
    amount: entry.amount,
    currency: entry.currency,
    description: entry.description ?? null,
    date: entry.date.toISOString(),
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
  };
}

function sumByType(entries: PrismaFinanceEntry[], type: string): number {
  return entries.filter((e) => e.type === type).reduce((acc, e) => acc + e.amount, 0);
}

export const financeService = {
  async getFinanceEntries(userId: string, limit = 100): Promise<FinanceEntry[]> {
    const entries = await prisma.financeEntry.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: limit,
    });
    return entries.map(serialize);
  },

  async getFinanceStats(userId: string): Promise<FinanceStats> {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const all = await prisma.financeEntry.findMany({ where: { userId } });
    const thisMonth = all.filter((e) => e.date >= monthStart && e.date <= monthEnd);

    return {
      thisMonthIncome: sumByType(thisMonth, "income"),
      thisMonthExpenses: sumByType(thisMonth, "expense"),
      thisMonthSavings: sumByType(thisMonth, "saving"),
      totalIncome: sumByType(all, "income"),
      totalExpenses: sumByType(all, "expense"),
      netSavings: sumByType(all, "income") - sumByType(all, "expense"),
    };
  },

  async getMonthlyTrend(userId: string): Promise<MonthlyTrend[]> {
    const now = new Date();
    const startDate = startOfMonth(subMonths(now, 5));

    const entries = await prisma.financeEntry.findMany({
      where: { userId, date: { gte: startDate } },
    });

    return Array.from({ length: 6 }, (_, i) => {
      const d = subMonths(now, 5 - i);
      const mStart = startOfMonth(d);
      const mEnd = endOfMonth(d);
      const monthEntries = entries.filter((e) => e.date >= mStart && e.date <= mEnd);

      return {
        month: format(d, "MMM yy"),
        income: sumByType(monthEntries, "income"),
        expenses: sumByType(monthEntries, "expense"),
        savings: sumByType(monthEntries, "saving"),
      };
    });
  },

  async getCategoryBreakdown(userId: string): Promise<CategoryBreakdown[]> {
    const entries = await prisma.financeEntry.findMany({
      where: { userId, type: "expense" },
    });

    const map = new Map<string, { amount: number; count: number }>();
    for (const e of entries) {
      const existing = map.get(e.category) ?? { amount: 0, count: 0 };
      map.set(e.category, { amount: existing.amount + e.amount, count: existing.count + 1 });
    }

    return Array.from(map.entries())
      .map(([category, { amount, count }]) => ({ category, amount, count }))
      .sort((a, b) => b.amount - a.amount);
  },

  async createFinanceEntry(userId: string, data: CreateFinanceInput): Promise<FinanceEntry> {
    const entry = await prisma.financeEntry.create({
      data: {
        userId,
        type: data.type,
        category: data.category,
        amount: data.amount,
        currency: data.currency,
        description: data.description ?? null,
        date: new Date(data.date),
      },
    });
    return serialize(entry);
  },

  async updateFinanceEntry(
    userId: string,
    id: string,
    data: UpdateFinanceInput
  ): Promise<FinanceEntry> {
    const existing = await prisma.financeEntry.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Finance entry");
    if (existing.userId !== userId) throw new ForbiddenError();

    const entry = await prisma.financeEntry.update({
      where: { id },
      data: {
        ...(data.type !== undefined && { type: data.type }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.amount !== undefined && { amount: data.amount }),
        ...(data.currency !== undefined && { currency: data.currency }),
        ...(data.description !== undefined && { description: data.description ?? null }),
        ...(data.date !== undefined && { date: new Date(data.date) }),
      },
    });
    return serialize(entry);
  },

  async deleteFinanceEntry(userId: string, id: string): Promise<void> {
    const existing = await prisma.financeEntry.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Finance entry");
    if (existing.userId !== userId) throw new ForbiddenError();
    await prisma.financeEntry.delete({ where: { id } });
  },
};
