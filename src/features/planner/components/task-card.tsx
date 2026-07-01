"use client";

import { motion, type Variants } from "framer-motion";
import { Pencil, Trash2, Clock } from "lucide-react";
import { GlassCard } from "@/shared/ui/glass-card";
import { GlassButton } from "@/shared/ui/glass-button";
import { GlassBadge } from "@/shared/ui/glass-badge";
import { cn } from "@/shared/utils/cn";
import type { Task } from "../types";
import {
  PRIORITY_COLORS,
  STATUS_COLORS,
  STATUS_LABELS,
  PRIORITY_LABELS,
  nextStatus,
} from "../utils/task-utils";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: Task["status"]) => void;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.15 } },
};

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps): React.ReactElement {
  const isDone = task.status === "done";

  return (
    <motion.div variants={cardVariants} layout>
      <GlassCard
        padding="sm"
        className={cn(
          "group flex items-start gap-3 transition-all duration-200",
          isDone && "opacity-60"
        )}
      >
        <button
          onClick={() => onStatusChange(task.id, nextStatus(task.status))}
          className={cn(
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200",
            isDone
              ? "border-green-500 bg-green-500"
              : "border-white/30 hover:border-primary"
          )}
          aria-label={`Mark as ${nextStatus(task.status)}`}
        >
          {isDone && (
            <svg
              className="h-2.5 w-2.5 text-white"
              fill="none"
              viewBox="0 0 12 12"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-sm font-medium leading-snug",
              isDone && "line-through text-muted-foreground"
            )}
          >
            {task.title}
          </p>

          {task.description && (
            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{task.description}</p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium",
                PRIORITY_COLORS[task.priority]
              )}
            >
              {PRIORITY_LABELS[task.priority]}
            </span>
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium",
                STATUS_COLORS[task.status]
              )}
            >
              {STATUS_LABELS[task.status]}
            </span>
            {task.category && (
              <GlassBadge className="text-[10px]">{task.category}</GlassBadge>
            )}
            {(task.startTime || task.endTime) && (
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock size={10} />
                {task.startTime}
                {task.endTime && ` – ${task.endTime}`}
              </span>
            )}
          </div>

          {task.tags.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-muted-foreground dark:bg-white/5"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          <GlassButton
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={() => onEdit(task)}
            aria-label="Edit task"
          >
            <Pencil size={13} />
          </GlassButton>
          <GlassButton
            size="icon"
            variant="ghost"
            className="h-7 w-7 hover:text-destructive"
            onClick={() => onDelete(task.id)}
            aria-label="Delete task"
          >
            <Trash2 size={13} />
          </GlassButton>
        </div>
      </GlassCard>
    </motion.div>
  );
}
