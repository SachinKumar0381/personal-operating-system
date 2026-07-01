"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Scale } from "lucide-react";
import { format } from "date-fns";
import { GlassCard } from "@/shared/ui/glass-card";
import { GlassButton } from "@/shared/ui/glass-button";
import type { WeightEntry } from "@/features/weight-tracker/types";

interface WeightListProps {
  entries: WeightEntry[];
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function WeightList({ entries, onDelete, isDeleting }: WeightListProps): React.ReactElement {
  if (entries.length === 0) {
    return (
      <GlassCard variant="elevated" padding="md" className="flex flex-col items-center gap-3 py-12">
        <Scale size={32} className="text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">No weight entries yet. Log your first one!</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard variant="elevated" padding="none" className="overflow-hidden">
      <div className="px-4 py-3">
        <p className="text-sm font-medium">History</p>
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
              className="group flex items-center justify-between px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Scale size={14} />
                </div>
                <div>
                  <p className="text-sm font-medium tabular-nums">
                    {entry.weight} {entry.unit}
                  </p>
                  {entry.notes && (
                    <p className="text-xs text-muted-foreground">{entry.notes}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-xs text-muted-foreground">
                  {format(new Date(entry.date), "d MMM yyyy")}
                </p>
                <GlassButton
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity"
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
