import { z } from "zod";

export const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"] as const;
export type MealType = (typeof MEAL_TYPES)[number];

export const mealItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  calories: z.number().int().nonnegative().optional().catch(undefined),
  protein: z.number().nonnegative().optional().catch(undefined),
  carbs: z.number().nonnegative().optional().catch(undefined),
  fat: z.number().nonnegative().optional().catch(undefined),
});

export const createMealSchema = z.object({
  mealType: z.enum(MEAL_TYPES),
  items: z.array(mealItemSchema).min(1, "At least one food item is required"),
  notes: z.string().max(500).optional(),
  date: z.string().min(1, "Date is required"),
});

export type MealItemInput = z.infer<typeof mealItemSchema>;
export type CreateMealInput = z.infer<typeof createMealSchema>;
