import { z } from "zod";

export const STUDY_SUBJECTS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "System Design",
  "DSA",
  "SQL",
  "MongoDB",
  "DevOps",
  "Computer Science",
  "Other",
] as const;

export const createStudySchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  topic: z.string().min(1, "Topic is required"),
  duration: z
    .number({ message: "Duration is required" })
    .int("Duration must be a whole number")
    .positive("Duration must be positive"),
  notes: z.string().max(1000).optional(),
  resources: z.string().optional(),
  date: z.string().min(1, "Date is required"),
});

export type CreateStudyInput = z.infer<typeof createStudySchema>;
