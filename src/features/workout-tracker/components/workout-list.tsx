"use client";

import { AnimatePresence } from "framer-motion";
import { Dumbbell } from "lucide-react";
import { GlassCard } from "@/shared/ui/glass-card";
import { WorkoutCard } from "@/features/workout-tracker/components/workout-card";
import type { WorkoutEntry } from "@/features/workout-tracker/types";

interface WorkoutListProps {
  entries: WorkoutEntry[];
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function WorkoutList({ entries, onDelete, isDeleting }: WorkoutListProps): React.ReactElement {
  if (entries.length === 0) {
    return (
      <GlassCard
        variant="elevated"
        padding="md"
        className="flex flex-col items-center gap-3 py-12"
      >
        <Dumbbell size={32} className="text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">
          No workouts logged yet. Start your first session!
        </p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {entries.map((entry) => (
          <WorkoutCard
            key={entry.id}
            entry={entry}
            onDelete={onDelete}
            isDeleting={isDeleting}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
