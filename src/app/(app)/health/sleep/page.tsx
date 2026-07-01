"use client";

import { Skeleton } from "@/shared/ui/skeleton";
import { useSleepEntries } from "@/features/sleep-tracker/hooks/use-sleep-entries";
import { useSleepMutations } from "@/features/sleep-tracker/hooks/use-sleep-mutations";
import { SleepStats } from "@/features/sleep-tracker/components/sleep-stats";
import { SleepChart } from "@/features/sleep-tracker/components/sleep-chart";
import { SleepForm } from "@/features/sleep-tracker/components/sleep-form";
import { SleepList } from "@/features/sleep-tracker/components/sleep-list";
import type { CreateSleepInput } from "@/features/sleep-tracker/schemas/sleep-schema";

export default function SleepPage(): React.ReactElement {
  const { data, isLoading } = useSleepEntries();
  const { createSleep, deleteSleep } = useSleepMutations();

  function handleCreate(input: CreateSleepInput) {
    createSleep.mutate(input);
  }

  function handleDelete(id: string) {
    deleteSleep.mutate(id);
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-60 rounded-2xl" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-52 rounded-2xl" />
          <Skeleton className="h-52 rounded-2xl" />
        </div>
      </div>
    );
  }

  const entries = data?.entries ?? [];
  const stats = data?.stats ?? {
    avgDuration: null,
    avgQuality: null,
    totalEntries: 0,
    lastNightDuration: null,
    lastNightQuality: null,
    weeklyEntries: [],
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Sleep Tracker</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track your sleep quality and duration over time.
        </p>
      </div>

      <SleepStats stats={stats} />
      <SleepChart entries={entries} />

      <div className="grid gap-6 lg:grid-cols-2">
        <SleepForm onSubmit={handleCreate} isLoading={createSleep.isPending} />
        <SleepList
          entries={entries}
          onDelete={handleDelete}
          isDeleting={deleteSleep.isPending}
        />
      </div>
    </div>
  );
}
