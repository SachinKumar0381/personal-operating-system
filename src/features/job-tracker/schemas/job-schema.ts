import { z } from "zod";

export const JOB_STATUSES = [
  "applied",
  "screening",
  "interview",
  "offer",
  "rejected",
  "withdrawn",
] as const;

export const createInterviewRoundSchema = z.object({
  round: z.string().min(1, "Round name is required").max(100),
  scheduledAt: z.string().optional().or(z.literal("")),
  outcome: z.string().max(100).optional(),
  notes: z.string().max(2000).optional(),
});

export const createJobSchema = z.object({
  company: z.string().min(1, "Company name is required").max(200),
  role: z.string().min(1, "Role is required").max(200),
  status: z.enum(JOB_STATUSES),
  salaryRange: z.string().max(100).optional(),
  jobUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  notes: z.string().max(2000).optional(),
  appliedAt: z.string().min(1, "Applied date is required"),
  followUpAt: z.string().optional().or(z.literal("")),
});

export const updateJobSchema = createJobSchema.partial();

export const createInterviewSchema = createInterviewRoundSchema;
export const updateInterviewSchema = createInterviewRoundSchema.partial();

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
export type CreateInterviewInput = z.infer<typeof createInterviewRoundSchema>;
export type UpdateInterviewInput = z.infer<typeof updateInterviewSchema>;
