import { z } from "zod";

export const FINANCE_TYPES = ["income", "expense", "saving"] as const;

export const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Investment",
  "Business",
  "Other",
] as const;

export const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Entertainment",
  "Utilities",
  "Healthcare",
  "Education",
  "Rent",
  "EMI",
  "Other",
] as const;

export const SAVING_CATEGORIES = [
  "Emergency Fund",
  "Investment",
  "Fixed Deposit",
  "Other",
] as const;

export const CATEGORIES_BY_TYPE = {
  income: INCOME_CATEGORIES,
  expense: EXPENSE_CATEGORIES,
  saving: SAVING_CATEGORIES,
} as const;

export const createFinanceSchema = z.object({
  type: z.enum(FINANCE_TYPES),
  category: z.string().min(1, "Category is required"),
  amount: z.number({ message: "Amount is required" }).positive("Amount must be positive"),
  currency: z.string().min(1, "Currency is required"),
  description: z.string().max(500).optional(),
  date: z.string().min(1, "Date is required"),
});

export const updateFinanceSchema = createFinanceSchema.partial();

export type CreateFinanceInput = z.infer<typeof createFinanceSchema>;
export type UpdateFinanceInput = z.infer<typeof updateFinanceSchema>;
