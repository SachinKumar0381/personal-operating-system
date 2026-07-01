import { z } from "zod";

export const TS_STATUSES = ["not_started", "in_progress", "completed", "blocked"] as const;
export const TS_PRIORITIES = ["low", "medium", "high"] as const;

export const TS_MODULES = [
  "Authentication & User Management",
  "Question Bank",
  "Test Engine",
  "Leaderboard",
  "Analytics Dashboard",
  "Payment & Subscription",
  "Admin Panel",
  "Mobile Responsive UI",
  "Notifications",
  "AI Features",
  "Performance Optimization",
  "Deployment & DevOps",
] as const;

export const createTestSeriesSchema = z.object({
  module: z.string().min(1, "Module name is required").max(200),
  status: z.enum(TS_STATUSES),
  priority: z.enum(TS_PRIORITIES),
  notes: z.string().max(500).optional(),
});

export const updateTestSeriesSchema = createTestSeriesSchema.partial();

export type CreateTestSeriesInput = z.infer<typeof createTestSeriesSchema>;
export type UpdateTestSeriesInput = z.infer<typeof updateTestSeriesSchema>;
