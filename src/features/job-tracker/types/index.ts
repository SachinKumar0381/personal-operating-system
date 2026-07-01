export type JobStatus =
  | "applied"
  | "screening"
  | "interview"
  | "offer"
  | "rejected"
  | "withdrawn";

export interface InterviewRound {
  id: string;
  applicationId: string;
  round: string;
  scheduledAt: string | null;
  outcome: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface JobApplication {
  id: string;
  userId: string;
  company: string;
  role: string;
  status: JobStatus;
  salaryRange: string | null;
  jobUrl: string | null;
  notes: string | null;
  appliedAt: string;
  followUpAt: string | null;
  createdAt: string;
  updatedAt: string;
  interviewRounds: InterviewRound[];
}

export interface JobStats {
  total: number;
  active: number;
  offers: number;
  rejected: number;
  byStatus: { status: JobStatus; count: number }[];
}

export interface JobFilters {
  status: string;
  search: string;
}
