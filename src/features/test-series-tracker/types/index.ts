export type TsStatus = "not_started" | "in_progress" | "completed" | "blocked";
export type TsPriority = "low" | "medium" | "high";

export interface TestSeriesEntry {
  id: string;
  userId: string;
  module: string;
  status: TsStatus;
  priority: TsPriority;
  notes: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TestSeriesStats {
  total: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  blocked: number;
  completionPercentage: number;
}

export interface TestSeriesData {
  entries: TestSeriesEntry[];
  stats: TestSeriesStats;
}
