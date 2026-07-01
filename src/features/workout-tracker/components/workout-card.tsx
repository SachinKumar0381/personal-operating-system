"use client";

import { motion } from "framer-motion";
import { Trash2, Dumbbell, Clock, Layers } from "lucide-react";
import { format } from "date-fns";
import { GlassCard } from "@/shared/ui/glass-card";
import { GlassButton } from "@/shared/ui/glass-button";
import { GlassBadge } from "@/shared/ui/glass-badge";
import type { WorkoutEntry } from "@/features/workout-tracker/types";

const TYPE_COLORS: Record<string, string> = {
  strength: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  cardio: "bg-red-500/15 text-red-600 dark:text-red-400",
  yoga: "bg-teal-500/15 text-teal-600 dark:text-teal-400",
  mixed: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
};

interface WorkoutCardProps {
  entry: WorkoutEntry;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

export function WorkoutCard({ entry, onDelete, isDeleting }: WorkoutCardProps): React.ReactElement {
  const typeColor = TYPE_COLORS[entry.type] ?? TYPE_COLORS.mixed;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.2 }}
    >
      <GlassCard variant="elevated" padding="md" className="group">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-500">
              <Dumbbell size={16} />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate font-medium">{entry.name}</p>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${typeColor}`}
                >
                  {entry.type}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  {formatDuration(entry.duration)}
                </span>
                {entry.exercises.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Layers size={11} />
                    {entry.exercises.length} exercise{entry.exercises.length !== 1 ? "s" : ""}
                  </span>
                )}
                <span>{format(new Date(entry.date), "d MMM yyyy")}</span>
              </div>
              {entry.notes && (
                <p className="mt-1.5 line-clamp-1 text-xs text-muted-foreground">{entry.notes}</p>
              )}
            </div>
          </div>
          <GlassButton
            size="icon"
            variant="ghost"
            className="h-7 w-7 shrink-0 opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
            onClick={() => onDelete(entry.id)}
            disabled={isDeleting}
            aria-label="Delete workout"
          >
            <Trash2 size={13} />
          </GlassButton>
        </div>

        {entry.exercises.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {entry.exercises.slice(0, 4).map((ex, i) => (
              <GlassBadge key={i} variant="default">
                {ex.name}
                {ex.sets && ex.reps ? ` ${ex.sets}×${ex.reps}` : ""}
                {ex.weight ? ` @ ${ex.weight}kg` : ""}
              </GlassBadge>
            ))}
            {entry.exercises.length > 4 && (
              <GlassBadge variant="default">+{entry.exercises.length - 4} more</GlassBadge>
            )}
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}
