"use client";

import { motion } from "framer-motion";
import { useStudyEntries } from "@/features/study-tracker/hooks/use-study-entries";
import { useStudyMutations } from "@/features/study-tracker/hooks/use-study-mutations";
import { StudyStats } from "@/features/study-tracker/components/study-stats";
import { StudyChart } from "@/features/study-tracker/components/study-chart";
import { StudyForm } from "@/features/study-tracker/components/study-form";
import { StudyList } from "@/features/study-tracker/components/study-list";
import { GlassCard } from "@/shared/ui/glass-card";
import type { CreateStudyInput } from "@/features/study-tracker/schemas/study-schema";

const emptyStats = {
  totalMinutesThisWeek: 0,
  totalHoursThisWeek: 0,
  totalSessions: 0,
  averageDurationMinutes: 0,
  subjectBreakdown: [],
};

export default function StudyPage(): React.ReactElement {
  const { data, isLoading } = useStudyEntries();
  const { createStudy, deleteStudy } = useStudyMutations();

  function handleCreate(input: CreateStudyInput) {
    createStudy.mutate(input);
  }

  function handleDelete(id: string) {
    deleteStudy.mutate(id);
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div>
        <h1 className="text-2xl font-semibold">Study Tracker</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Log your study sessions and track progress by subject.
        </p>
      </div>

      {isLoading ? (
        <GlassCard variant="elevated" padding="md" className="flex h-40 items-center justify-center">
          <p className="text-sm text-muted-foreground">Loading…</p>
        </GlassCard>
      ) : (
        <>
          <StudyStats stats={data?.stats ?? emptyStats} />

          <StudyChart
            dailyPoints={data?.dailyPoints ?? []}
            subjectBreakdown={data?.stats.subjectBreakdown ?? []}
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <StudyForm onSubmit={handleCreate} isLoading={createStudy.isPending} />
            <StudyList
              entries={data?.entries ?? []}
              onDelete={handleDelete}
              isDeleting={deleteStudy.isPending}
            />
          </div>
        </>
      )}
    </motion.div>
  );
}
