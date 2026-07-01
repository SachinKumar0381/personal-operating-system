"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import { GlassCard } from "@/shared/ui/glass-card";
import { GlassButton } from "@/shared/ui/glass-button";
import { ResumeStatsSection } from "@/features/resume-versions/components/resume-stats";
import { ResumeForm } from "@/features/resume-versions/components/resume-form";
import { ResumeList } from "@/features/resume-versions/components/resume-list";
import { useResumeVersions } from "@/features/resume-versions/hooks/use-resume-versions";
import { useResumeMutations } from "@/features/resume-versions/hooks/use-resume-mutations";
import type { ResumeVersion } from "@/features/resume-versions/types";
import type { CreateResumeInput } from "@/features/resume-versions/schemas/resume-schema";

export default function ResumePage(): React.ReactElement {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ResumeVersion | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activatingId, setActivatingId] = useState<string | null>(null);

  const { data, isLoading } = useResumeVersions();
  const { addVersion, editVersion, removeVersion, setActive } = useResumeMutations();

  function handleAdd(input: CreateResumeInput) {
    addVersion.mutate(input, { onSuccess: () => setShowForm(false) });
  }

  function handleEdit(input: CreateResumeInput) {
    if (!editing) return;
    editVersion.mutate(
      { id: editing.id, data: input },
      { onSuccess: () => setEditing(null) }
    );
  }

  function handleDelete(id: string) {
    setDeletingId(id);
    removeVersion.mutate(id, { onSettled: () => setDeletingId(null) });
  }

  function handleActivate(id: string) {
    setActivatingId(id);
    setActive.mutate(id, { onSettled: () => setActivatingId(null) });
  }

  const versions = data?.versions ?? [];
  const stats = data?.stats ?? { total: 0, hasActive: false, activeVersion: null };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Resume Versions</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your resume versions. Click the circle to set one as active.
          </p>
        </div>
        <GlassButton
          variant="primary"
          size="md"
          onClick={() => {
            setEditing(null);
            setShowForm((v) => !v);
          }}
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Cancel" : "Add Version"}
        </GlassButton>
      </div>

      {/* Stats */}
      {!isLoading && <ResumeStatsSection stats={stats} />}

      {/* Add Form */}
      <AnimatePresence>
        {showForm && !editing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <GlassCard variant="elevated" padding="md">
              <h2 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                New Resume Version
              </h2>
              <ResumeForm
                onSubmit={handleAdd}
                onCancel={() => setShowForm(false)}
                isLoading={addVersion.isPending}
              />
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Form */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <GlassCard variant="elevated" padding="md" className="ring-1 ring-primary/20">
              <h2 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Edit — {editing.version}
              </h2>
              <ResumeForm
                defaultValues={editing}
                onSubmit={handleEdit}
                onCancel={() => setEditing(null)}
                isLoading={editVersion.isPending}
              />
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      <ResumeList
        versions={versions}
        isLoading={isLoading}
        onEdit={(r) => {
          setShowForm(false);
          setEditing(r);
        }}
        onDelete={handleDelete}
        onActivate={handleActivate}
        deletingId={deletingId}
        activatingId={activatingId}
      />
    </motion.div>
  );
}
