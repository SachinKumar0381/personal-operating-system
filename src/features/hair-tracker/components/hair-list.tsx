"use client";

import { format } from "date-fns";
import { Trash2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/shared/ui/glass-card";
import { GlassButton } from "@/shared/ui/glass-button";
import { GlassBadge } from "@/shared/ui/glass-badge";
import { cn } from "@/shared/utils/cn";
import type { HairEntry } from "@/features/hair-tracker/types";

interface HairListProps {
  entries: HairEntry[];
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

const typeLabels: Record<string, string> = {
  oil: "Oil Treatment",
  wash: "Hair Wash",
  treatment: "Deep Treatment",
  supplement: "Supplement",
  other: "Other",
};

const typeVariant: Record<string, "default" | "primary" | "success" | "warning" | "destructive"> = {
  oil: "warning",
  wash: "primary",
  treatment: "default",
  supplement: "success",
  other: "default",
};

const typeDotColor: Record<string, string> = {
  oil: "bg-amber-500",
  wash: "bg-blue-500",
  treatment: "bg-purple-500",
  supplement: "bg-green-500",
  other: "bg-gray-400",
};

export function HairList({ entries, onDelete, isDeleting }: HairListProps): React.ReactElement {
  if (entries.length === 0) {
    return (
      <GlassCard variant="elevated" padding="md">
        <p className="mb-4 text-sm font-medium">Hair Care Timeline</p>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <Sparkles size={32} className="mb-3 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No hair care entries yet.</p>
          <p className="mt-1 text-xs text-muted-foreground/60">
            Start logging your hair care routine.
          </p>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard variant="elevated" padding="md">
      <p className="mb-4 text-sm font-medium">Hair Care Timeline</p>
      <ul className="relative space-y-0">
        <div className="absolute left-[11px] top-2 bottom-2 w-px bg-white/10 dark:bg-white/5" />
        <AnimatePresence initial={false}>
          {entries.map((entry) => (
            <motion.li
              key={entry.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="relative flex items-start gap-3 pb-4 last:pb-0"
            >
              <div
                className={cn(
                  "relative z-10 mt-1 h-5 w-5 shrink-0 rounded-full border-2 border-background",
                  typeDotColor[entry.type] ?? "bg-gray-400"
                )}
              />
              <div className="flex min-w-0 flex-1 items-start justify-between gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 hover:bg-white/10 dark:border-white/5 transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <GlassBadge variant={typeVariant[entry.type] ?? "default"}>
                      {typeLabels[entry.type] ?? entry.type}
                    </GlassBadge>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(entry.date), "d MMM yyyy")}
                    </span>
                  </div>
                  {entry.products.length > 0 && (
                    <p className="mt-1.5 flex flex-wrap gap-1">
                      {entry.products.map((p) => (
                        <span
                          key={p}
                          className="rounded-full border border-white/15 bg-white/8 px-2 py-0.5 text-xs text-muted-foreground dark:border-white/10"
                        >
                          {p}
                        </span>
                      ))}
                    </p>
                  )}
                  {entry.notes && (
                    <p className="mt-1 truncate text-xs text-muted-foreground/70">{entry.notes}</p>
                  )}
                </div>
                <GlassButton
                  size="icon"
                  variant="ghost"
                  onClick={() => onDelete(entry.id)}
                  disabled={isDeleting}
                  aria-label="Delete hair entry"
                  className="ml-1 shrink-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 size={13} />
                </GlassButton>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </GlassCard>
  );
}
