import { z } from "zod";

export const SLEEP_QUALITY = [1, 2, 3, 4, 5] as const;

export const createSleepSchema = z.object({
  bedTime: z.string().min(1, "Bed time is required"),
  wakeTime: z.string().min(1, "Wake time is required"),
  quality: z.number().int().min(1).max(5),
  notes: z.string().max(500).optional(),
  date: z.string().min(1, "Date is required"),
});

export type CreateSleepInput = z.infer<typeof createSleepSchema>;
