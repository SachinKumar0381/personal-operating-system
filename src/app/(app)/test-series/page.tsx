"use client";

import { useState } from "react";
import { Skeleton } from "@/shared/ui/skeleton";
import { useTestSeries } from "@/features/test-series-tracker/hooks/use-test-series";
import { useTestSeriesMutations } from "@/features/test-series-tracker/hooks/use-test-series-mutations";
import { TsStats } from "@/features/test-series-tracker/components/ts-stats";
import { TsBoard } from "@/features/test-series-tracker/components/ts-board";
import { TsForm } from "@/features/test-series-tracker/components/ts-form";
import type { CreateTestSeriesInput } from "@/features/test-series-tracker/schemas/test-series-schema";
import type { TestSeriesEntry, TsStatus, TestSeriesStats } from "@/features/test-series-tracker/types";

const DEFAULT_STATS: TestSeriesStats = {
  total: 0,
  completed: 0,
  inProgress: 0,
  notStarted: 0,
  blocked: 0,
  completionPercentage: 0,
};

export default function TestSeriesPage(): React.ReactElement {
  const { data, isLoading } = useTestSeries();
  const { createModule, updateModule, deleteModule } = useTestSeriesMutations();
  const [editEntry, setEditEntry] = useState<TestSeriesEntry | null>(null);

  function handleCreate(input: CreateTestSeriesInput): void {
    createModule.mutate(input);
  }

  function handleUpdate(input: CreateTestSeriesInput): void {
    if (!editEntry) return;
    updateModule.mutate(
      { id: editEntry.id, data: input },
      { onSuccess: () => setEditEntry(null) }
    );
  }

  function handleDelete(id: string): void {
    deleteModule.mutate(id);
  }

  function handleStatusChange(id: string, status: TsStatus): void {
    updateModule.mutate({ id, data: { status } });
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-10 rounded-2xl" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const entries = data?.entries ?? [];
  const stats = data?.stats ?? DEFAULT_STATS;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Test Series Tracker</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track progress on building the Test Series SaaS project.
        </p>
      </div>

      <TsStats stats={stats} />

      <TsBoard
        entries={entries}
        onEdit={setEditEntry}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        isDeleting={deleteModule.isPending}
        isUpdating={updateModule.isPending}
      />

      {editEntry ? (
        <TsForm
          onSubmit={handleUpdate}
          onCancel={() => setEditEntry(null)}
          editEntry={editEntry}
          isLoading={updateModule.isPending}
        />
      ) : (
        <TsForm onSubmit={handleCreate} isLoading={createModule.isPending} />
      )}
    </div>
  );
}
