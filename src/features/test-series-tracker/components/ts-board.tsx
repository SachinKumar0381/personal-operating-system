"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Pencil,
  Trash2,
  CheckCircle2,
  Clock,
  Circle,
  AlertCircle,
  FlaskConical,
} from "lucide-react";
import { GlassCard } from "@/shared/ui/glass-card";
import { GlassButton } from "@/shared/ui/glass-button";
import { cn } from "@/shared/utils/cn";
import type { TestSeriesEntry, TsStatus, TsPriority } from "@/features/test-series-tracker/types";

interface TsBoardProps {
  entries: TestSeriesEntry[];
  onEdit: (entry: TestSeriesEntry) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TsStatus) => void;
  isDeleting?: boolean;
  isUpdating?: boolean;
}

const STATUS_CONFIG: Record<
  TsStatus,
  { label: string; icon: React.ReactNode; badgeClass: string; colClass: string }
> = {
  not_started: {
    label: "Not Started",
    icon: <Circle size={13} />,
    badgeClass: "bg-muted/40 text-muted-foreground border-white/15",
    colClass: "border-white/10",
  },
  in_progress: {
    label: "In Progress",
    icon: <Clock size={13} />,
    badgeClass: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20",
    colClass: "border-blue-500/20",
  },
  completed: {
    label: "Completed",
    icon: <CheckCircle2 size={13} />,
    badgeClass: "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/20",
    colClass: "border-green-500/20",
  },
  blocked: {
    label: "Blocked",
    icon: <AlertCircle size={13} />,
    badgeClass: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/20",
    colClass: "border-red-500/20",
  },
};

const STATUS_ORDER: TsStatus[] = ["in_progress", "not_started", "blocked", "completed"];

const NEXT_STATUS: Record<TsStatus, TsStatus> = {
  not_started: "in_progress",
  in_progress: "completed",
  completed: "not_started",
  blocked: "in_progress",
};

const PRIORITY_COLOR: Record<TsPriority, string> = {
  high: "text-red-500",
  medium: "text-yellow-500",
  low: "text-green-500",
};

interface ModuleCardProps {
  entry: TestSeriesEntry;
  onEdit: (entry: TestSeriesEntry) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TsStatus) => void;
  isDeleting?: boolean;
  isUpdating?: boolean;
}

function ModuleCard({
  entry,
  onEdit,
  onDelete,
  onStatusChange,
  isDeleting,
  isUpdating,
}: ModuleCardProps): React.ReactElement {
  const cfg = STATUS_CONFIG[entry.status];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.18 }}
    >
      <GlassCard variant="elevated" padding="md" className="group space-y-3">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium leading-snug">{entry.module}</p>
          <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <GlassButton
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              onClick={() => onEdit(entry)}
              aria-label="Edit module"
            >
              <Pencil size={11} />
            </GlassButton>
            <GlassButton
              size="icon"
              variant="ghost"
              className="h-6 w-6 hover:text-destructive"
              onClick={() => onDelete(entry.id)}
              disabled={isDeleting}
              aria-label="Delete module"
            >
              <Trash2 size={11} />
            </GlassButton>
          </div>
        </div>

        {entry.notes && (
          <p className="line-clamp-2 text-[11px] text-muted-foreground">{entry.notes}</p>
        )}

        <div className="flex items-center justify-between pt-0.5">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm",
              cfg.badgeClass
            )}
          >
            {cfg.icon}
            {cfg.label}
          </span>
          <div className="flex items-center gap-2">
            <span className={cn("text-[10px] font-medium capitalize", PRIORITY_COLOR[entry.priority])}>
              {entry.priority}
            </span>
            <GlassButton
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-[10px]"
              onClick={() => onStatusChange(entry.id, NEXT_STATUS[entry.status])}
              disabled={isUpdating}
              aria-label="Advance status"
            >
              Move →
            </GlassButton>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export function TsBoard({
  entries,
  onEdit,
  onDelete,
  onStatusChange,
  isDeleting,
  isUpdating,
}: TsBoardProps): React.ReactElement {
  if (entries.length === 0) {
    return (
      <GlassCard
        variant="elevated"
        padding="md"
        className="flex flex-col items-center gap-3 py-16"
      >
        <FlaskConical size={36} className="text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground">
          No modules yet. Add your first Test Series module.
        </p>
      </GlassCard>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {STATUS_ORDER.map((status) => {
        const cfg = STATUS_CONFIG[status];
        const columnEntries = entries.filter((e) => e.status === status);

        return (
          <div key={status} className="flex flex-col gap-3">
            <div
              className={cn(
                "flex items-center gap-2 rounded-xl border px-3 py-2",
                "bg-white/5 dark:bg-white/3",
                cfg.colClass
              )}
            >
              <span className="flex items-center gap-1.5 text-xs font-medium">
                {cfg.icon}
                {cfg.label}
              </span>
              <span className="ml-auto text-xs text-muted-foreground">{columnEntries.length}</span>
            </div>

            <div className="flex min-h-[4rem] flex-col gap-2.5">
              <AnimatePresence mode="popLayout">
                {columnEntries.map((entry) => (
                  <ModuleCard
                    key={entry.id}
                    entry={entry}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStatusChange={onStatusChange}
                    isDeleting={isDeleting}
                    isUpdating={isUpdating}
                  />
                ))}
              </AnimatePresence>
              {columnEntries.length === 0 && (
                <div className="flex h-16 items-center justify-center rounded-xl border border-dashed border-white/10 text-xs text-muted-foreground/50">
                  Empty
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
