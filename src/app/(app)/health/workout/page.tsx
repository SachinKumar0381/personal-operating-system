"use client";

import { Skeleton } from "@/shared/ui/skeleton";
import { useWorkoutEntries } from "@/features/workout-tracker/hooks/use-workout-entries";
import { useWorkoutMutations } from "@/features/workout-tracker/hooks/use-workout-mutations";
import { WorkoutStats } from "@/features/workout-tracker/components/workout-stats";
import { WorkoutForm } from "@/features/workout-tracker/components/workout-form";
import { WorkoutList } from "@/features/workout-tracker/components/workout-list";
import type { CreateWorkoutInput } from "@/features/workout-tracker/schemas/workout-schema";

export default function WorkoutPage(): React.ReactElement {
  const { data, isLoading } = useWorkoutEntries();
  const { createWorkout, deleteWorkout } = useWorkoutMutations();

  function handleCreate(input: CreateWorkoutInput): void {
    createWorkout.mutate(input);
  }

  function handleDelete(id: string): void {
    deleteWorkout.mutate(id);
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-96 rounded-2xl" />
          <Skeleton className="h-52 rounded-2xl" />
        </div>
      </div>
    );
  }

  const entries = data?.entries ?? [];
  const stats = data?.stats ?? {
    totalThisWeek: 0,
    minutesThisWeek: 0,
    totalEntries: 0,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Workout Tracker</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Log your exercise sessions and track weekly progress.
        </p>
      </div>

      <WorkoutStats stats={stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <WorkoutForm onSubmit={handleCreate} isLoading={createWorkout.isPending} />
        <div className="space-y-3">
          <p className="text-sm font-medium">Recent Sessions</p>
          <WorkoutList
            entries={entries}
            onDelete={handleDelete}
            isDeleting={deleteWorkout.isPending}
          />
        </div>
      </div>
    </div>
  );
}
