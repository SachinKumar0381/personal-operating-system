import { z } from "zod";

export const MOOD_OPTIONS = ["great", "good", "neutral", "stressed", "anxious", "angry"] as const;
export type MoodOption = (typeof MOOD_OPTIONS)[number];

export const TRIGGER_OPTIONS = [
  "stress",
  "boredom",
  "social",
  "after_meal",
  "coffee",
  "alcohol",
  "habit",
  "other",
] as const;
export type TriggerOption = (typeof TRIGGER_OPTIONS)[number];

export const createSmokingSchema = z.object({
  cigarettesSmoked: z
    .number()
    .int()
    .min(0, "Cannot be negative")
    .max(100, "Maximum 100"),
  cravings: z
    .number()
    .int()
    .min(0, "Cannot be negative")
    .max(50, "Maximum 50"),
  mood: z.enum(MOOD_OPTIONS).optional(),
  trigger: z.enum(TRIGGER_OPTIONS).optional(),
  notes: z.string().max(500).optional(),
  date: z.string().min(1, "Date is required"),
});

export type CreateSmokingInput = z.infer<typeof createSmokingSchema>;
