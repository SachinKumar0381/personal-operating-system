export interface SmokingEntry {
  id: string;
  userId: string;
  cigarettesSmoked: number;
  cravings: number;
  mood: string | null;
  trigger: string | null;
  notes: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface SmokingStats {
  totalEntries: number;
  currentStreak: number;
  longestStreak: number;
  cravingsResisted: number;
  avgCigarettesToday: number | null;
  avgCigarettesThisWeek: number | null;
  smokeFreeToday: boolean;
}
