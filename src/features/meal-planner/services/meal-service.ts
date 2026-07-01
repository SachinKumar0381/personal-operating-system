import { prisma } from "@/core/database";
import { NotFoundError, ForbiddenError } from "@/core/errors";
import { startOfDay, endOfDay } from "date-fns";
import type { MealEntry as PrismaMealEntry, Prisma } from "@prisma/client";
import type { CreateMealInput } from "@/features/meal-planner/schemas/meal-schema";
import type { MealEntry, MealItem, MealStats } from "@/features/meal-planner/types";

function serializeItems(items: Prisma.JsonValue[]): MealItem[] {
  return items.map((item) => {
    const i = item as Record<string, unknown>;
    return {
      name: String(i.name ?? ""),
      calories: typeof i.calories === "number" ? i.calories : undefined,
      protein: typeof i.protein === "number" ? i.protein : undefined,
      carbs: typeof i.carbs === "number" ? i.carbs : undefined,
      fat: typeof i.fat === "number" ? i.fat : undefined,
    };
  });
}

function serialize(entry: PrismaMealEntry): MealEntry {
  return {
    id: entry.id,
    userId: entry.userId,
    mealType: entry.mealType,
    items: serializeItems(entry.items),
    totalCalories: entry.totalCalories ?? null,
    notes: entry.notes ?? null,
    date: entry.date.toISOString(),
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
  };
}

export const mealService = {
  async getMealEntries(userId: string, date?: string): Promise<MealEntry[]> {
    const where = date
      ? {
          userId,
          date: {
            gte: startOfDay(new Date(date)),
            lte: endOfDay(new Date(date)),
          },
        }
      : { userId };

    const entries = await prisma.mealEntry.findMany({
      where,
      orderBy: { date: "desc" },
      ...(date ? {} : { take: 30 }),
    });
    return entries.map(serialize);
  },

  async getMealStats(userId: string, date: string): Promise<MealStats> {
    const entries = await mealService.getMealEntries(userId, date);

    let todayCalories = 0;
    let todayProtein = 0;
    let todayCarbs = 0;
    let todayFat = 0;

    for (const entry of entries) {
      for (const item of entry.items) {
        todayCalories += item.calories ?? 0;
        todayProtein += item.protein ?? 0;
        todayCarbs += item.carbs ?? 0;
        todayFat += item.fat ?? 0;
      }
    }

    return {
      todayCalories,
      todayProtein: Math.round(todayProtein * 10) / 10,
      todayCarbs: Math.round(todayCarbs * 10) / 10,
      todayFat: Math.round(todayFat * 10) / 10,
      mealCount: entries.length,
    };
  },

  async createMealEntry(userId: string, data: CreateMealInput): Promise<MealEntry> {
    const totalCalories = data.items.reduce((sum, item) => sum + (item.calories ?? 0), 0);
    const entry = await prisma.mealEntry.create({
      data: {
        userId,
        mealType: data.mealType,
        items: data.items as Prisma.InputJsonValue[],
        totalCalories: totalCalories > 0 ? totalCalories : null,
        notes: data.notes ?? null,
        date: new Date(data.date),
      },
    });
    return serialize(entry);
  },

  async deleteMealEntry(userId: string, id: string): Promise<void> {
    const entry = await prisma.mealEntry.findUnique({ where: { id } });
    if (!entry) throw new NotFoundError("Meal entry");
    if (entry.userId !== userId) throw new ForbiddenError();
    await prisma.mealEntry.delete({ where: { id } });
  },
};
