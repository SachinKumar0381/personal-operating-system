"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trash2, BookOpen, Clock, Tag } from "lucide-react";
import { format } from "date-fns";
import { GlassCard } from "@/shared/ui/glass-card";
import { GlassButton } from "@/shared/ui/glass-button";
import { GlassBadge } from "@/shared/ui/glass-badge";
import type { StudyEntry } from "@/features/study-tracker/types";

interface StudyListProps {
  entries: StudyEntry[];
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function StudyList({ entries, onDelete, isDeleting }: StudyListProps): React.ReactElement {
  if (entries.length === 0) {
    return (
      <GlassCard
        variant="elevated"
        padding="md"
        className="flex flex-col items-center gap-3 py-12"
      >
        <BookOpen size={32} className="text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">
          No study sessions yet. Log your first one!
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard variant="elevated" padding="none" className="overflow-hidden">
      <div className="px-4 py-3">
        <p className="text-sm font-medium">Recent Sessions</p>
      </div>
      <div className="divide-y divide-white/10">
        <AnimatePresence initial={false}>
          {entries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="group px-4 py-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <BookOpen size={14} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium">{entry.topic}</p>
                      <GlassBadge variant="primary" className="text-[10px]">
                        {entry.subject}
                      </GlassBadge>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {formatDuration(entry.duration)}
                      </span>
                      <span>{format(new Date(entry.date), "d MMM yyyy")}</span>
                    </div>
                    {entry.resources.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap items-center gap-1">
                        <Tag size={10} className="text-muted-foreground" />
                        {entry.resources.map((r, i) => (
                          <span
                            key={i}
                            className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] text-muted-foreground"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    )}
                    {entry.notes && (
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        {entry.notes}
                      </p>
                    )}
                  </div>
                </div>
                <GlassButton
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                  onClick={() => onDelete(entry.id)}
                  disabled={isDeleting}
                  aria-label="Delete entry"
                >
                  <Trash2 size={13} />
                </GlassButton>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
}
