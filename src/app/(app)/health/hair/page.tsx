"use client";

import { Skeleton } from "@/shared/ui/skeleton";
import { useHairEntries } from "@/features/hair-tracker/hooks/use-hair-entries";
import { useHairMutations } from "@/features/hair-tracker/hooks/use-hair-mutations";
import { HairStats } from "@/features/hair-tracker/components/hair-stats";
import { HairForm } from "@/features/hair-tracker/components/hair-form";
import { HairList } from "@/features/hair-tracker/components/hair-list";
import type { CreateHairInput } from "@/features/hair-tracker/schemas/hair-schema";

export default function HairPage(): React.ReactElement {
  const { data, isLoading } = useHairEntries();
  const { createHair, deleteHair } = useHairMutations();

  function handleCreate(input: CreateHairInput) {
    createHair.mutate(input);
  }

  function handleDelete(id: string) {
    deleteHair.mutate(id);
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
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
    entriesThisMonth: 0,
    mostUsedProduct: null,
    lastEntryDate: null,
    typeBreakdown: {},
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Hair Recovery Tracker</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Log your hair care routine and track your recovery journey.
        </p>
      </div>

      <HairStats stats={stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <HairForm onSubmit={handleCreate} isLoading={createHair.isPending} />
        <HairList
          entries={entries}
          onDelete={handleDelete}
          isDeleting={deleteHair.isPending}
        />
      </div>
    </div>
  );
}
