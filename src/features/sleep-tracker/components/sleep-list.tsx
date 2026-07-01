"use client";

import { format } from "date-fns";
import { Trash2, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/shared/ui/glass-card";
import { GlassButton } from "@/shared/ui/glass-button";
import { GlassBadge } from "@/shared/ui/glass-badge";
import type { SleepEntry } from "@/features/sleep-tracker/types";

interface SleepListProps {
  entries: SleepEntry[];
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

function formatDuration(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function formatTime(iso: string): string {
  return format(new Date(iso), "h:mm a");
}

function qualityVariant(quality: number): "success" | "warning" | "default" {
  if (quality >= 4) return "success";
  if (quality >= 3) return "warning";
  return "default";
}

function qualityLabel(quality: number): string {
  const map: Record<number, string> = { 1: "Very Poor", 2: "Poor", 3: "Fair", 4: "Good", 5: "Excellent" };
  return map[quality] ?? String(quality);
}

export function SleepList({ entries, onDelete, isDeleting }: SleepListProps): React.ReactElement {
  if (entries.length === 0) {
    return (
      <GlassCard variant="elevated" padding="md">
        <p className="mb-4 text-sm font-medium">Sleep History</p>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <Moon size={32} className="mb-3 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No sleep entries yet.</p>
          <p className="mt-1 text-xs text-muted-foreground/60">Log your first night to get started.</p>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard variant="elevated" padding="md">
      <p className="mb-4 text-sm font-medium">Sleep History</p>
      <ul className="space-y-2">
        <AnimatePresence initial={false}>
          {entries.map((entry) => (
            <motion.li
              key={entry.id}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-3 transition-colors hover:bg-white/10 dark:border-white/5">
                <div className="flex min-w-0 flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium tabular-nums">
                      {formatDuration(entry.duration)}
                    </span>
                    <GlassBadge variant={qualityVariant(entry.quality)}>
                      {qualityLabel(entry.quality)}
                    </GlassBadge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatTime(entry.bedTime)} → {formatTime(entry.wakeTime)}
                    {" · "}
                    {format(new Date(entry.date), "d MMM yyyy")}
                  </p>
                  {entry.notes && (
                    <p className="mt-0.5 truncate text-xs text-muted-foreground/70">{entry.notes}</p>
                  )}
                </div>
                <GlassButton
                  size="icon"
                  variant="ghost"
                  onClick={() => onDelete(entry.id)}
                  disabled={isDeleting}
                  aria-label="Delete sleep entry"
                  className="ml-2 shrink-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 size={14} />
                </GlassButton>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </GlassCard>
  );
}
