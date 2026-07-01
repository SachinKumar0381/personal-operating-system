export type DsaPlatform = "LeetCode" | "GFG" | "Codeforces" | "HackerRank" | "Other";
export type DsaDifficulty = "Easy" | "Medium" | "Hard";
export type DsaStatus = "solved" | "attempted" | "revisit";
export type DsaCategory =
  | "Arrays"
  | "Strings"
  | "Linked Lists"
  | "Trees"
  | "Graphs"
  | "Dynamic Programming"
  | "Recursion"
  | "Backtracking"
  | "Sorting"
  | "Binary Search"
  | "Stacks & Queues"
  | "Heaps"
  | "Hashing"
  | "Greedy"
  | "Two Pointers"
  | "Sliding Window"
  | "Bit Manipulation"
  | "Math"
  | "Other";

export interface DsaProblem {
  id: string;
  userId: string;
  title: string;
  platform: DsaPlatform;
  difficulty: DsaDifficulty;
  category: DsaCategory;
  status: DsaStatus;
  url: string | null;
  notes: string | null;
  timeComplexity: string | null;
  spaceComplexity: string | null;
  solvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DsaStats {
  total: number;
  solved: number;
  attempted: number;
  revisit: number;
  easy: number;
  medium: number;
  hard: number;
  goal: number;
  byCategory: CategoryStat[];
}

export interface CategoryStat {
  category: string;
  count: number;
}

export interface DsaFilters {
  platform: string;
  difficulty: string;
  category: string;
  status: string;
  search: string;
}
