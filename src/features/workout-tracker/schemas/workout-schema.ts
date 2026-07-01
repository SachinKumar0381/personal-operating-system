import { z } from "zod";

export const WORKOUT_TYPES = ["strength", "cardio", "yoga", "mixed"] as const;
export type WorkoutType = (typeof WORKOUT_TYPES)[number];

export const exerciseSchema = z.object({
  name: z.string().min(1, "Exercise name is required"),
  sets: z.number().int().positive().optional().catch(undefined),
  reps: z.number().int().positive().optional().catch(undefined),
  weight: z.number().positive().optional().catch(undefined),
  duration: z.number().positive().optional().catch(undefined),
});

export const createWorkoutSchema = z.object({
  name: z.string().min(1, "Workout name is required"),
  type: z.enum(WORKOUT_TYPES),
  duration: z
    .number({ message: "Duration is required" })
    .int()
    .positive("Duration must be a positive number"),
  exercises: z.array(exerciseSchema),
  notes: z.string().max(500).optional(),
  date: z.string().min(1, "Date is required"),
});

export type ExerciseInput = z.infer<typeof exerciseSchema>;
export type CreateWorkoutInput = z.infer<typeof createWorkoutSchema>;
