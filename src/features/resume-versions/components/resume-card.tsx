"use client";

import { ExternalLink, Edit2, Trash2, CheckCircle2, Circle } from "lucide-react";
import { motion } from "framer-motion";
import { GlassCard } from "@/shared/ui/glass-card";
import { GlassBadge } from "@/shared/ui/glass-badge";
import { GlassButton } from "@/shared/ui/glass-button";
import { formatDate } from "@/shared/utils/date";
import type { ResumeVersion } from "@/features/resume-versions/types";

interface ResumeCardProps {
  resume: ResumeVersion;
  onEdit: (resume: ResumeVersion) => void;
  onDelete: (id: string) => void;
  onActivate: (id: string) => void;
  isDeleting?: boolean;
  isActivating?: boolean;
}

export function ResumeCard({
  resume,
  onEdit,
  onDelete,
  onActivate,
  isDeleting,
  isActivating,
}: ResumeCardProps): React.ReactElement {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <GlassCard
        variant="elevated"
        padding="md"
        className={resume.isActive ? "ring-1 ring-primary/30" : ""}
      >
        <div className="flex items-start gap-3">
          <button
            onClick={() => !resume.isActive && onActivate(resume.id)}
            disabled={resume.isActive || isActivating}
            title={resume.isActive ? "Active version" : "Set as active"}
            className="mt-0.5 shrink-0 transition-colors disabled:cursor-default"
          >
            {resume.isActive ? (
              <CheckCircle2 size={18} className="text-primary" />
            ) : (
              <Circle size={18} className="text-muted-foreground/40 hover:text-primary/60 transition-colors" />
            )}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold leading-tight">{resume.version}</p>
              {resume.isActive && (
                <GlassBadge variant="success">Active</GlassBadge>
              )}
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Added {formatDate(resume.createdAt)}
              {resume.updatedAt !== resume.createdAt && (
                <> · Updated {formatDate(resume.updatedAt)}</>
              )}
            </p>

            {resume.notes && (
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{resume.notes}</p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {resume.fileUrl && (
              <a href={resume.fileUrl} target="_blank" rel="noopener noreferrer">
                <GlassButton size="icon" variant="ghost" className="h-8 w-8" title="Open file">
                  <ExternalLink size={13} />
                </GlassButton>
              </a>
            )}
            <GlassButton
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => onEdit(resume)}
              title="Edit"
            >
              <Edit2 size={13} />
            </GlassButton>
            <GlassButton
              size="icon"
              variant="ghost"
              className="h-8 w-8 hover:text-destructive"
              onClick={() => onDelete(resume.id)}
              disabled={isDeleting}
              title="Delete"
            >
              <Trash2 size={13} />
            </GlassButton>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
