export interface StudyEntry {
  id: string;
  userId: string;
  subject: string;
  topic: string;
  duration: number;
  notes: string | null;
  resources: string[];
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudyStats {
  totalMinutesThisWeek: number;
  totalHoursThisWeek: number;
  totalSessions: number;
  averageDurationMinutes: number;
  subjectBreakdown: SubjectStat[];
}

export interface SubjectStat {
  subject: string;
  totalMinutes: number;
  sessions: number;
}

export interface DailyStudyPoint {
  date: string;
  minutes: number;
  hours: number;
}
