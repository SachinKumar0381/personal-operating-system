export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export type DateRange = {
  from: Date;
  to: Date;
};

export type Theme = "light" | "dark" | "system";

export type Priority = "low" | "medium" | "high";

export type Status = "todo" | "in_progress" | "done";
