export type SdStatus = "not_started" | "in_progress" | "completed" | "needs_revision";

export interface SystemDesignTopic {
  id: string;
  userId: string;
  title: string;
  status: SdStatus;
  concepts: string[];
  notes: string | null;
  resources: string[];
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SdStats {
  total: number;
  notStarted: number;
  inProgress: number;
  completed: number;
  needsRevision: number;
  completionPct: number;
}

export interface SdFilters {
  status: string;
  search: string;
}
