import { z } from "zod";

export const createResumeSchema = z.object({
  version: z.string().min(1, "Version name is required").max(100),
  fileUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  notes: z.string().max(2000).optional(),
  isActive: z.boolean().optional(),
});

export const updateResumeSchema = createResumeSchema.partial();

export type CreateResumeInput = z.infer<typeof createResumeSchema>;
export type UpdateResumeInput = z.infer<typeof updateResumeSchema>;
