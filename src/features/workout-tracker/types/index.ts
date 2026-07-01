export interface WorkoutExercise {
  name: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number;
}

export interface WorkoutEntry {
  id: string;
  userId: string;
  name: string;
  type: string;
  duration: number;
  exercises: WorkoutExercise[];
  notes: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutStats {
  totalThisWeek: number;
  minutesThisWeek: number;
  totalEntries: number;
}
