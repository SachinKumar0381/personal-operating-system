"use client";

import { format } from "date-fns";
import { Trash2, Cigarette } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/shared/ui/glass-card";
import { GlassButton } from "@/shared/ui/glass-button";
import { GlassBadge } from "@/shared/ui/glass-badge";
import type { SmokingEntry } from "@/features/smoking-tracker/types";

interface SmokingListProps {
  entries: SmokingEntry[];
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

const moodEmoji: Record<string, string> = {
  great: "😊",
  good: "🙂",
  neutral: "😐",
  stressed: "😤",
  anxious: "😰",
  angry: "😠",
};

const triggerLabel: Record<string, string> = {
  stress: "Stress",
  boredom: "Boredom",
  social: "Social",
  after_meal: "After meal",
  coffee: "Coffee",
  alcohol: "Alcohol",
  habit: "Habit",
  other: "Other",
};

export function SmokingList({ entries, onDelete, isDeleting }: SmokingListProps): React.ReactElement {
  if (entries.length === 0) {
    return (
      <GlassCard variant="elevated" padding="md">
        <p className="mb-4 text-sm font-medium">Recent Entries</p>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <Cigarette size={32} className="mb-3 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No entries yet.</p>
          <p className="mt-1 text-xs text-muted-foreground/60">
            Start logging to track your progress.
          </p>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard variant="elevated" padding="md">
      <p className="mb-4 text-sm font-medium">Recent Entries</p>
      <ul className="space-y-2">
        <AnimatePresence initial={false}>
          {entries.map((entry) => {
            const smokeFreee = entry.cigarettesSmoked === 0;
            return (
              <motion.li
                key={entry.id}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex items-start justify-between gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 hover:bg-white/10 dark:border-white/5 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-foreground">
                      {format(new Date(entry.date), "d MMM yyyy")}
                    </span>
                    <GlassBadge variant={smokeFreee ? "success" : "destructive"}>
                      {smokeFreee ? "Smoke-free" : `${entry.cigarettesSmoked} smoked`}
                    </GlassBadge>
                    {entry.cravings > 0 && (
                      <GlassBadge variant="primary">
                        {entry.cravings} craving{entry.cravings > 1 ? "s" : ""} resisted
                      </GlassBadge>
                    )}
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    {entry.mood && (
                      <span>{moodEmoji[entry.mood] ?? ""} {entry.mood}</span>
                    )}
                    {entry.trigger && (
                      <span className="rounded-full border border-white/15 bg-white/8 px-2 py-0.5 dark:border-white/10">
                        {triggerLabel[entry.trigger] ?? entry.trigger}
                      </span>
                    )}
                    {entry.notes && (
                      <span className="truncate text-muted-foreground/70">{entry.notes}</span>
                    )}
                  </div>
                </div>
                <GlassButton
                  size="icon"
                  variant="ghost"
                  onClick={() => onDelete(entry.id)}
                  disabled={isDeleting}
                  aria-label="Delete smoking entry"
                  className="ml-1 shrink-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 size={13} />
                </GlassButton>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </GlassCard>
  );
}
