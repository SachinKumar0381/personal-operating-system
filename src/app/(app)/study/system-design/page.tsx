"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { useSdTopics } from "@/features/system-design-tracker/hooks/use-sd-topics";
import { useSdMutations } from "@/features/system-design-tracker/hooks/use-sd-mutations";
import { SdStats } from "@/features/system-design-tracker/components/sd-stats";
import { SdBoard } from "@/features/system-design-tracker/components/sd-board";
import { SdForm } from "@/features/system-design-tracker/components/sd-form";
import { SdFiltersBar } from "@/features/system-design-tracker/components/sd-filters";
import { GlassCard } from "@/shared/ui/glass-card";
import { GlassButton } from "@/shared/ui/glass-button";
import type { CreateSdInput, UpdateSdInput } from "@/features/system-design-tracker/schemas/sd-schema";
import type {
  SystemDesignTopic,
  SdFilters,
  SdStats as SdStatsType,
  SdStatus,
} from "@/features/system-design-tracker/types";

const EMPTY_STATS: SdStatsType = {
  total: 0,
  notStarted: 0,
  inProgress: 0,
  completed: 0,
  needsRevision: 0,
  completionPct: 0,
};

const DEFAULT_FILTERS: SdFilters = { status: "", search: "" };

export default function SystemDesignPage(): React.ReactElement {
  const { data, isLoading } = useSdTopics();
  const { addTopic, editTopic, removeTopic } = useSdMutations();

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<SystemDesignTopic | null>(null);
  const [filters, setFilters] = useState<SdFilters>(DEFAULT_FILTERS);

  const filteredTopics = useMemo(() => {
    const topics = data?.topics ?? [];
    return topics.filter((t) => {
      if (filters.status && t.status !== filters.status) return false;
      if (
        filters.search &&
        !t.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !t.notes?.toLowerCase().includes(filters.search.toLowerCase()) &&
        !t.concepts.some((c) => c.toLowerCase().includes(filters.search.toLowerCase()))
      ) {
        return false;
      }
      return true;
    });
  }, [data?.topics, filters]);

  function handleAdd(input: CreateSdInput) {
    addTopic.mutate(input, { onSuccess: () => setShowForm(false) });
  }

  function handleEdit(input: CreateSdInput) {
    if (!editTarget) return;
    const updateData: UpdateSdInput = {
      title: input.title,
      status: input.status,
      concepts: input.concepts,
      notes: input.notes,
      resources: input.resources,
    };
    editTopic.mutate(
      { id: editTarget.id, data: updateData },
      { onSuccess: () => setEditTarget(null) }
    );
  }

  function handleStatusChange(id: string, status: SdStatus) {
    editTopic.mutate({ id, data: { status } });
  }

  function handleStartEdit(topic: SystemDesignTopic) {
    setEditTarget(topic);
    setShowForm(false);
  }

  function handleCancelEdit() {
    setEditTarget(null);
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">System Design Tracker</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track your system design learning — topics, concepts, progress.
          </p>
        </div>
        <GlassButton
          variant={showForm ? "ghost" : "primary"}
          size="md"
          onClick={() => {
            setShowForm((v) => !v);
            setEditTarget(null);
          }}
          className="shrink-0 gap-2"
        >
          {showForm ? (
            <>
              <X size={15} /> Close
            </>
          ) : (
            <>
              <Plus size={15} /> Add Topic
            </>
          )}
        </GlassButton>
      </div>

      {isLoading ? (
        <GlassCard
          variant="elevated"
          padding="md"
          className="flex h-40 items-center justify-center"
        >
          <p className="text-sm text-muted-foreground">Loading…</p>
        </GlassCard>
      ) : (
        <>
          <SdStats stats={data?.stats ?? EMPTY_STATS} />

          {(showForm || editTarget) && (
            <SdForm
              key={editTarget?.id ?? "new-topic-form"}
              onSubmit={editTarget ? handleEdit : handleAdd}
              onCancel={editTarget ? handleCancelEdit : () => setShowForm(false)}
              isLoading={addTopic.isPending || editTopic.isPending}
              editTopic={editTarget}
            />
          )}

          <SdFiltersBar filters={filters} onChange={setFilters} />

          <SdBoard
            topics={filteredTopics}
            onEdit={handleStartEdit}
            onDelete={(id) => removeTopic.mutate(id)}
            onStatusChange={handleStatusChange}
            isDeleting={removeTopic.isPending}
            isUpdating={editTopic.isPending}
          />
        </>
      )}
    </motion.div>
  );
}
