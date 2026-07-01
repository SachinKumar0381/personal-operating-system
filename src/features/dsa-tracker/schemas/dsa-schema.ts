import { z } from "zod";

export const DSA_PLATFORMS = ["LeetCode", "GFG", "Codeforces", "HackerRank", "Other"] as const;
export const DSA_DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
export const DSA_STATUSES = ["solved", "attempted", "revisit"] as const;
export const DSA_CATEGORIES = [
  "Arrays",
  "Strings",
  "Linked Lists",
  "Trees",
  "Graphs",
  "Dynamic Programming",
  "Recursion",
  "Backtracking",
  "Sorting",
  "Binary Search",
  "Stacks & Queues",
  "Heaps",
  "Hashing",
  "Greedy",
  "Two Pointers",
  "Sliding Window",
  "Bit Manipulation",
  "Math",
  "Other",
] as const;

export const DSA_GOAL = 300;

export const createDsaSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  platform: z.enum(DSA_PLATFORMS),
  difficulty: z.enum(DSA_DIFFICULTIES),
  category: z.enum(DSA_CATEGORIES),
  status: z.enum(DSA_STATUSES),
  url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  notes: z.string().max(2000).optional(),
  timeComplexity: z.string().max(50).optional(),
  spaceComplexity: z.string().max(50).optional(),
});

export const updateDsaSchema = createDsaSchema.partial();

export type CreateDsaInput = z.infer<typeof createDsaSchema>;
export type UpdateDsaInput = z.infer<typeof updateDsaSchema>;
