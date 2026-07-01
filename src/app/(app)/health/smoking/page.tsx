"use client";

import { Skeleton } from "@/shared/ui/skeleton";
import { useSmokingEntries } from "@/features/smoking-tracker/hooks/use-smoking-entries";
import { useSmokingMutations } from "@/features/smoking-tracker/hooks/use-smoking-mutations";
import { SmokingStats } from "@/features/smoking-tracker/components/smoking-stats";
import { SmokingForm } from "@/features/smoking-tracker/components/smoking-form";
import { SmokingList } from "@/features/smoking-tracker/components/smoking-list";
import { SmokingChart } from "@/features/smoking-tracker/components/smoking-chart";
import type { CreateSmokingInput } from "@/features/smoking-tracker/schemas/smoking-schema";

export default function SmokingPage(): React.ReactElement {
  const { data, isLoading } = useSmokingEntries();
  const { createSmoking, deleteSmoking } = useSmokingMutations();

  function handleCreate(input: CreateSmokingInput) {
    createSmoking.mutate(input);
  }

  function handleDelete(id: string) {
    deleteSmoking.mutate(id);
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-72 rounded-2xl" />
          <Skeleton className="h-72 rounded-2xl" />
        </div>
      </div>
    );
  }

  const entries = data?.entries ?? [];
  const stats = data?.stats ?? {
    totalEntries: 0,
    currentStreak: 0,
    longestStreak: 0,
    cravingsResisted: 0,
    avgCigarettesToday: null,
    avgCigarettesThisWeek: null,
    smokeFreeToday: false,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Smoking Tracker</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track your smoking reduction journey and celebrate every smoke-free day.
        </p>
      </div>

      <SmokingStats stats={stats} />

      <SmokingChart entries={entries} />

      <div className="grid gap-6 lg:grid-cols-2">
        <SmokingForm onSubmit={handleCreate} isLoading={createSmoking.isPending} />
        <SmokingList
          entries={entries}
          onDelete={handleDelete}
          isDeleting={deleteSmoking.isPending}
        />
      </div>
    </div>
  );
}
