export interface WeightEntry {
  id: string;
  userId: string;
  weight: number;
  unit: string;
  notes: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface WeightStats {
  currentWeight: number | null;
  previousWeight: number | null;
  change: number | null;
  unit: string;
  totalEntries: number;
}
