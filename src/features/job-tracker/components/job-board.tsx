"use client";

import { GlassCard } from "@/shared/ui/glass-card";
import { GlassBadge } from "@/shared/ui/glass-badge";
import { JobCard } from "@/features/job-tracker/components/job-card";
import type { JobApplication, JobStatus } from "@/features/job-tracker/types";
import type { CreateInterviewInput } from "@/features/job-tracker/schemas/job-schema";
import { cn } from "@/shared/utils/cn";

type BadgeVariant = "default" | "primary" | "success" | "warning" | "destructive";

const BOARD_COLUMNS: {
  status: JobStatus;
  label: string;
  variant: BadgeVariant;
  accent: string;
}[] = [
  { status: "applied", label: "Applied", variant: "default", accent: "border-blue-500/30" },
  { status: "screening", label: "Screening", variant: "warning", accent: "border-yellow-500/30" },
  { status: "interview", label: "Interview", variant: "primary", accent: "border-purple-500/30" },
  { status: "offer", label: "Offer", variant: "success", accent: "border-green-500/30" },
  { status: "rejected", label: "Rejected", variant: "destructive", accent: "border-red-500/30" },
  { status: "withdrawn", label: "Withdrawn", variant: "default", accent: "border-muted/30" },
];

interface JobBoardProps {
  applications: JobApplication[];
  onEdit: (job: JobApplication) => void;
  onDelete: (id: string) => void;
  onAddRound: (applicationId: string, data: CreateInterviewInput) => void;
  onDeleteRound: (roundId: string) => void;
  isDeleting?: boolean;
  isAddingRound?: boolean;
}

export function JobBoard({
  applications,
  onEdit,
  onDelete,
  onAddRound,
  onDeleteRound,
  isDeleting,
  isAddingRound,
}: JobBoardProps): React.ReactElement {
  const grouped = new Map<JobStatus, JobApplication[]>();
  for (const col of BOARD_COLUMNS) {
    grouped.set(col.status, []);
  }
  for (const app of applications) {
    const list = grouped.get(app.status);
    if (list) list.push(app);
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {BOARD_COLUMNS.map((col) => {
        const items = grouped.get(col.status) ?? [];
        return (
          <GlassCard
            key={col.status}
            variant="subtle"
            padding="md"
            className={cn("border-t-2", col.accent)}
          >
            <div className="mb-3 flex items-center gap-2">
              <GlassBadge variant={col.variant}>{col.label}</GlassBadge>
              <span className="text-xs text-muted-foreground">
                {items.length} {items.length === 1 ? "application" : "applications"}
              </span>
            </div>

            <div className="space-y-3">
              {items.length === 0 ? (
                <p className="py-4 text-center text-xs text-muted-foreground">None</p>
              ) : (
                items.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onAddRound={onAddRound}
                    onDeleteRound={onDeleteRound}
                    isDeleting={isDeleting}
                    isAddingRound={isAddingRound}
                  />
                ))
              )}
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
}
