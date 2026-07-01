export interface SleepEntry {
  id: string;
  userId: string;
  bedTime: string;
  wakeTime: string;
  duration: number;
  quality: number;
  notes: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface SleepStats {
  avgDuration: number | null;
  avgQuality: number | null;
  totalEntries: number;
  lastNightDuration: number | null;
  lastNightQuality: number | null;
  weeklyEntries: SleepEntry[];
}
