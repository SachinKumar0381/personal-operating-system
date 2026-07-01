export interface HairEntry {
  id: string;
  userId: string;
  type: string;
  products: string[];
  notes: string | null;
  photos: string[];
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface HairStats {
  totalEntries: number;
  entriesThisMonth: number;
  mostUsedProduct: string | null;
  lastEntryDate: string | null;
  typeBreakdown: Record<string, number>;
}
