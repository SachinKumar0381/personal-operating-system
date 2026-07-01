"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, X, Search } from "lucide-react";
import { useJobs } from "@/features/job-tracker/hooks/use-jobs";
import { useJobMutations } from "@/features/job-tracker/hooks/use-job-mutations";
import { JobStats } from "@/features/job-tracker/components/job-stats";
import { JobBoard } from "@/features/job-tracker/components/job-board";
import { JobForm } from "@/features/job-tracker/components/job-form";
import { GlassCard } from "@/shared/ui/glass-card";
import { GlassButton } from "@/shared/ui/glass-button";
import { GlassInput } from "@/shared/ui/glass-input";
import type { CreateJobInput, UpdateJobInput, CreateInterviewInput } from "@/features/job-tracker/schemas/job-schema";
import type { JobApplication, JobStats as JobStatsType } from "@/features/job-tracker/types";

const EMPTY_STATS: JobStatsType = {
  total: 0,
  active: 0,
  offers: 0,
  rejected: 0,
  byStatus: [],
};

export default function JobsPage(): React.ReactElement {
  const { data, isLoading } = useJobs();
  const { addJob, editJob, removeJob, addRound, removeRound } = useJobMutations();

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<JobApplication | null>(null);
  const [search, setSearch] = useState("");

  const applications = data?.applications ?? [];
  const filteredApplications = search
    ? applications.filter(
        (a) =>
          a.company.toLowerCase().includes(search.toLowerCase()) ||
          a.role.toLowerCase().includes(search.toLowerCase())
      )
    : applications;

  function handleAdd(input: CreateJobInput) {
    addJob.mutate(input, { onSuccess: () => setShowForm(false) });
  }

  function handleEdit(input: CreateJobInput) {
    if (!editTarget) return;
    const updateData: UpdateJobInput = {
      company: input.company,
      role: input.role,
      status: input.status,
      salaryRange: input.salaryRange,
      jobUrl: input.jobUrl,
      notes: input.notes,
      appliedAt: input.appliedAt,
      followUpAt: input.followUpAt,
    };
    editJob.mutate(
      { id: editTarget.id, data: updateData },
      { onSuccess: () => setEditTarget(null) }
    );
  }

  function handleStartEdit(job: JobApplication) {
    setEditTarget(job);
    setShowForm(false);
  }

  function handleAddRound(applicationId: string, roundData: CreateInterviewInput) {
    addRound.mutate({ applicationId, data: roundData });
  }

  function handleDeleteRound(roundId: string) {
    removeRound.mutate({ roundId });
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
          <h1 className="text-2xl font-semibold">Job Switch Tracker</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track your job applications and interview pipeline.
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
              <Plus size={15} /> Add Application
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
          <JobStats stats={data?.stats ?? EMPTY_STATS} />

          {(showForm || editTarget) && (
            <JobForm
              onSubmit={editTarget ? handleEdit : handleAdd}
              onCancel={
                editTarget ? () => setEditTarget(null) : () => setShowForm(false)
              }
              isLoading={addJob.isPending || editJob.isPending}
              editJob={editTarget}
            />
          )}

          <div className="relative max-w-sm">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <GlassInput
              placeholder="Search company or role…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>

          <JobBoard
            applications={filteredApplications}
            onEdit={handleStartEdit}
            onDelete={(id) => removeJob.mutate(id)}
            onAddRound={handleAddRound}
            onDeleteRound={handleDeleteRound}
            isDeleting={removeJob.isPending}
            isAddingRound={addRound.isPending}
          />
        </>
      )}
    </motion.div>
  );
}
