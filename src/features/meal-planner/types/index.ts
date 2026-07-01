export interface MealItem {
  name: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export interface MealEntry {
  id: string;
  userId: string;
  mealType: string;
  items: MealItem[];
  totalCalories: number | null;
  notes: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface MealStats {
  todayCalories: number;
  todayProtein: number;
  todayCarbs: number;
  todayFat: number;
  mealCount: number;
}

export interface MealData {
  entries: MealEntry[];
  stats: MealStats;
}
