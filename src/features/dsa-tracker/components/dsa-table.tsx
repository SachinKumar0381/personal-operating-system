"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, ExternalLink, Code2 } from "lucide-react";
import { GlassCard } from "@/shared/ui/glass-card";
import { GlassButton } from "@/shared/ui/glass-button";
import { cn } from "@/shared/utils/cn";
import type { DsaProblem } from "@/features/dsa-tracker/types";

interface DsaTableProps {
  problems: DsaProblem[];
  onEdit: (problem: DsaProblem) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

const DIFFICULTY_STYLES: Record<string, string> = {
  Easy: "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/20",
  Medium: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
  Hard: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/20",
};

const STATUS_STYLES: Record<string, string> = {
  solved: "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/20",
  attempted: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20",
  revisit: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/20",
};

const STATUS_LABELS: Record<string, string> = {
  solved: "Solved",
  attempted: "Attempted",
  revisit: "Revisit",
};

export function DsaTable({ problems, onEdit, onDelete, isDeleting }: DsaTableProps): React.ReactElement {
  if (problems.length === 0) {
    return (
      <GlassCard
        variant="elevated"
        padding="md"
        className="flex flex-col items-center gap-3 py-16"
      >
        <Code2 size={36} className="text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground">No problems match your filters.</p>
      </GlassCard>
    );
  }

  return (
    <GlassCard variant="elevated" padding="none" className="overflow-hidden">
      <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 border-b border-white/10 px-4 py-2.5 text-xs font-medium text-muted-foreground sm:grid">
        <span>Problem</span>
        <span>Platform</span>
        <span>Difficulty</span>
        <span>Category</span>
        <span>Status</span>
        <span />
      </div>

      <div className="divide-y divide-white/10">
        <AnimatePresence initial={false}>
          {problems.map((problem) => (
            <motion.div
              key={problem.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
              className="group px-4 py-3"
            >
              <div className="flex items-start justify-between gap-3 sm:grid sm:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] sm:items-center">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {problem.url ? (
                      <a
                        href={problem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1 truncate"
                      >
                        {problem.title}
                        <ExternalLink size={11} className="shrink-0 opacity-50" />
                      </a>
                    ) : (
                      <span className="text-sm font-medium truncate">{problem.title}</span>
                    )}
                  </div>
                  {(problem.timeComplexity || problem.spaceComplexity) && (
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      {problem.timeComplexity && `Time: ${problem.timeComplexity}`}
                      {problem.timeComplexity && problem.spaceComplexity && " · "}
                      {problem.spaceComplexity && `Space: ${problem.spaceComplexity}`}
                    </p>
                  )}
                  {problem.notes && (
                    <p className="mt-0.5 line-clamp-1 text-[10px] text-muted-foreground">
                      {problem.notes}
                    </p>
                  )}
                  <div className="mt-1 flex flex-wrap gap-1.5 sm:hidden">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border backdrop-blur-sm",
                        DIFFICULTY_STYLES[problem.difficulty]
                      )}
                    >
                      {problem.difficulty}
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border backdrop-blur-sm",
                        STATUS_STYLES[problem.status]
                      )}
                    >
                      {STATUS_LABELS[problem.status]}
                    </span>
                  </div>
                </div>

                <span className="hidden text-xs text-muted-foreground sm:block">
                  {problem.platform}
                </span>

                <span
                  className={cn(
                    "hidden sm:inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border backdrop-blur-sm w-fit",
                    DIFFICULTY_STYLES[problem.difficulty]
                  )}
                >
                  {problem.difficulty}
                </span>

                <span className="hidden text-xs text-muted-foreground sm:block">
                  {problem.category}
                </span>

                <span
                  className={cn(
                    "hidden sm:inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border backdrop-blur-sm w-fit",
                    STATUS_STYLES[problem.status]
                  )}
                >
                  {STATUS_LABELS[problem.status]}
                </span>

                <div className="flex shrink-0 gap-1">
                  <GlassButton
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => onEdit(problem)}
                    aria-label="Edit problem"
                  >
                    <Pencil size={13} />
                  </GlassButton>
                  <GlassButton
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                    onClick={() => onDelete(problem.id)}
                    disabled={isDeleting}
                    aria-label="Delete problem"
                  >
                    <Trash2 size={13} />
                  </GlassButton>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="border-t border-white/10 px-4 py-2 text-xs text-muted-foreground">
        {problems.length} problem{problems.length !== 1 ? "s" : ""}
      </div>
    </GlassCard>
  );
}

