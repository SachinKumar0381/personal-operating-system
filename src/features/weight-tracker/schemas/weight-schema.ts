import { z } from "zod";

export const WEIGHT_UNITS = ["kg", "lbs"] as const;

export const createWeightSchema = z.object({
  weight: z.number({ message: "Weight is required" }).positive("Weight must be positive"),
  unit: z.enum(WEIGHT_UNITS),
  date: z.string().min(1, "Date is required"),
  notes: z.string().max(500).optional(),
});

export type CreateWeightInput = z.infer<typeof createWeightSchema>;
