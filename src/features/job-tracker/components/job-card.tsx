"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  ExternalLink,
  Calendar,
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
  Plus,
  X,
} from "lucide-react";
import { GlassCard } from "@/shared/ui/glass-card";
import { GlassBadge } from "@/shared/ui/glass-badge";
import { GlassButton } from "@/shared/ui/glass-button";
import { GlassInput } from "@/shared/ui/glass-input";
import { cn } from "@/shared/utils/cn";
import { formatDate } from "@/shared/utils/date";
import type { JobApplication, JobStatus } from "@/features/job-tracker/types";
import type { CreateInterviewInput } from "@/features/job-tracker/schemas/job-schema";

type BadgeVariant = "default" | "primary" | "success" | "warning" | "destructive";

const STATUS_CONFIG: Record<
  JobStatus,
  { label: string; variant: BadgeVariant; color: string }
> = {
  applied: { label: "Applied", variant: "default", color: "text-blue-500" },
  screening: { label: "Screening", variant: "warning", color: "text-yellow-500" },
  interview: { label: "Interview", variant: "primary", color: "text-purple-500" },
  offer: { label: "Offer", variant: "success", color: "text-green-500" },
  rejected: { label: "Rejected", variant: "destructive", color: "text-red-500" },
  withdrawn: { label: "Withdrawn", variant: "default", color: "text-muted-foreground" },
};

interface InterviewRoundFormProps {
  onAdd: (data: CreateInterviewInput) => void;
  onClose: () => void;
  isLoading?: boolean;
}

function InterviewRoundForm({ onAdd, onClose, isLoading }: InterviewRoundFormProps) {
  const [round, setRound] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [outcome, setOutcome] = useState("");
  const [notes, setNotes] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!round.trim()) return;
    onAdd({ round, scheduledAt, outcome, notes });
    setRound("");
    setScheduledAt("");
    setOutcome("");
    setNotes("");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-2 rounded-xl border border-white/10 bg-white/5 p-3">
      <p className="text-xs font-medium text-muted-foreground">Add Interview Round</p>
      <GlassInput
        placeholder="Round name (e.g. Technical Round 1)"
        value={round}
        onChange={(e) => setRound(e.target.value)}
        className="h-8 text-xs"
      />
      <div className="grid grid-cols-2 gap-2">
        <GlassInput
          type="date"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
          className="h-8 text-xs"
        />
        <GlassInput
          placeholder="Outcome (optional)"
          value={outcome}
          onChange={(e) => setOutcome(e.target.value)}
          className="h-8 text-xs"
        />
      </div>
      <GlassInput
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="h-8 text-xs"
      />
      <div className="flex gap-2">
        <GlassButton type="submit" variant="primary" size="sm" className="flex-1" disabled={isLoading || !round.trim()}>
          {isLoading ? "Adding…" : "Add Round"}
        </GlassButton>
        <GlassButton type="button" variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </GlassButton>
      </div>
    </form>
  );
}

interface JobCardProps {
  job: JobApplication;
  onEdit: (job: JobApplication) => void;
  onDelete: (id: string) => void;
  onAddRound: (applicationId: string, data: CreateInterviewInput) => void;
  onDeleteRound: (roundId: string) => void;
  isDeleting?: boolean;
  isAddingRound?: boolean;
}

export function JobCard({
  job,
  onEdit,
  onDelete,
  onAddRound,
  onDeleteRound,
  isDeleting,
  isAddingRound,
}: JobCardProps): React.ReactElement {
  const [expanded, setExpanded] = useState(false);
  const [showRoundForm, setShowRoundForm] = useState(false);
  const config = STATUS_CONFIG[job.status];

  return (
    <GlassCard variant="elevated" padding="md" className="transition-all duration-200">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 dark:bg-white/5">
          <Building2 size={18} className="text-muted-foreground" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold leading-tight">{job.company}</p>
            <GlassBadge variant={config.variant}>{config.label}</GlassBadge>
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">{job.role}</p>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar size={11} />
              Applied {formatDate(job.appliedAt)}
            </span>
            {job.salaryRange && <span>{job.salaryRange}</span>}
            {job.followUpAt && (
              <span className="text-yellow-600 dark:text-yellow-400">
                Follow-up {formatDate(job.followUpAt)}
              </span>
            )}
          </div>

          {job.notes && (
            <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{job.notes}</p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {job.jobUrl && (
            <a href={job.jobUrl} target="_blank" rel="noopener noreferrer">
              <GlassButton size="icon" variant="ghost" className="h-8 w-8">
                <ExternalLink size={13} />
              </GlassButton>
            </a>
          )}
          <GlassButton size="icon" variant="ghost" className="h-8 w-8" onClick={() => onEdit(job)}>
            <Edit2 size={13} />
          </GlassButton>
          <GlassButton
            size="icon"
            variant="ghost"
            className="h-8 w-8 hover:text-destructive"
            onClick={() => onDelete(job.id)}
            disabled={isDeleting}
          >
            <Trash2 size={13} />
          </GlassButton>
          <GlassButton
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </GlassButton>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="mt-4 border-t border-white/10 pt-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground">
                  Interview Rounds ({job.interviewRounds.length})
                </p>
                <GlassButton
                  size="sm"
                  variant="ghost"
                  className="h-6 gap-1 px-2 text-xs"
                  onClick={() => setShowRoundForm((v) => !v)}
                >
                  {showRoundForm ? <X size={11} /> : <Plus size={11} />}
                  {showRoundForm ? "Close" : "Add Round"}
                </GlassButton>
              </div>

              {job.interviewRounds.length === 0 && !showRoundForm && (
                <p className="text-xs text-muted-foreground">No interview rounds yet.</p>
              )}

              <div className="space-y-2">
                {job.interviewRounds.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-start justify-between gap-2 rounded-lg bg-white/5 px-3 py-2 text-xs"
                  >
                    <div>
                      <p className="font-medium">{r.round}</p>
                      {r.scheduledAt && (
                        <p className="mt-0.5 text-muted-foreground">
                          {formatDate(r.scheduledAt)}
                        </p>
                      )}
                      {r.outcome && (
                        <p className={cn("mt-0.5", r.outcome.toLowerCase().includes("pass") ? "text-green-500" : r.outcome.toLowerCase().includes("fail") ? "text-red-500" : "text-muted-foreground")}>
                          {r.outcome}
                        </p>
                      )}
                      {r.notes && <p className="mt-0.5 text-muted-foreground">{r.notes}</p>}
                    </div>
                    <button
                      onClick={() => onDeleteRound(r.id)}
                      className="mt-0.5 shrink-0 text-muted-foreground/50 hover:text-destructive transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>

              {showRoundForm && (
                <InterviewRoundForm
                  onAdd={(data) => {
                    onAddRound(job.id, data);
                    setShowRoundForm(false);
                  }}
                  onClose={() => setShowRoundForm(false)}
                  isLoading={isAddingRound}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}
