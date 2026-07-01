"use client";

import { AnimatePresence } from "framer-motion";
import { FileText } from "lucide-react";
import { Skeleton } from "@/shared/ui/skeleton";
import { ResumeCard } from "@/features/resume-versions/components/resume-card";
import type { ResumeVersion } from "@/features/resume-versions/types";

interface ResumeListProps {
  versions: ResumeVersion[];
  isLoading: boolean;
  onEdit: (resume: ResumeVersion) => void;
  onDelete: (id: string) => void;
  onActivate: (id: string) => void;
  deletingId: string | null;
  activatingId: string | null;
}

export function ResumeList({
  versions,
  isLoading,
  onEdit,
  onDelete,
  onActivate,
  deletingId,
  activatingId,
}: ResumeListProps): React.ReactElement {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (versions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/20 py-16 text-center">
        <FileText size={32} className="text-muted-foreground/40" />
        <div>
          <p className="font-medium text-muted-foreground">No resume versions yet</p>
          <p className="text-sm text-muted-foreground/70">Add your first resume version above.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {versions.map((resume) => (
          <ResumeCard
            key={resume.id}
            resume={resume}
            onEdit={onEdit}
            onDelete={onDelete}
            onActivate={onActivate}
            isDeleting={deletingId === resume.id}
            isActivating={activatingId === resume.id}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
