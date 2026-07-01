"use client";

import { Skeleton } from "@/shared/ui/skeleton";
import { useWeightEntries } from "@/features/weight-tracker/hooks/use-weight-entries";
import { useWeightMutations } from "@/features/weight-tracker/hooks/use-weight-mutations";
import { WeightStats } from "@/features/weight-tracker/components/weight-stats";
import { WeightChart } from "@/features/weight-tracker/components/weight-chart";
import { WeightForm } from "@/features/weight-tracker/components/weight-form";
import { WeightList } from "@/features/weight-tracker/components/weight-list";
import type { CreateWeightInput } from "@/features/weight-tracker/schemas/weight-schema";

export default function WeightPage(): React.ReactElement {
  const { data, isLoading } = useWeightEntries();
  const { createWeight, deleteWeight } = useWeightMutations();

  function handleCreate(input: CreateWeightInput) {
    createWeight.mutate(input);
  }

  function handleDelete(id: string) {
    deleteWeight.mutate(id);
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
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
    currentWeight: null,
    previousWeight: null,
    change: null,
    unit: "kg",
    totalEntries: 0,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Weight Tracker</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track your weight journey with charts and history.
        </p>
      </div>

      <WeightStats stats={stats} />
      <WeightChart entries={entries} />

      <div className="grid gap-6 lg:grid-cols-2">
        <WeightForm onSubmit={handleCreate} isLoading={createWeight.isPending} />
        <WeightList
          entries={entries}
          onDelete={handleDelete}
          isDeleting={deleteWeight.isPending}
        />
      </div>
    </div>
  );
}
