import { z } from "zod";

export const HAIR_TYPES = ["oil", "wash", "treatment", "supplement", "other"] as const;
export type HairType = (typeof HAIR_TYPES)[number];

export const createHairSchema = z.object({
  type: z.enum(HAIR_TYPES, { message: "Select a valid activity type" }),
  products: z.array(z.string().min(1)).optional(),
  notes: z.string().max(500).optional(),
  photoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  date: z.string().min(1, "Date is required"),
});

export type CreateHairInput = z.infer<typeof createHairSchema>;
