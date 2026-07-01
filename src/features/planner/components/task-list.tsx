"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList } from "lucide-react";
import { Skeleton } from "@/shared/ui/skeleton";
import { GlassCard } from "@/shared/ui/glass-card";
import type { Task } from "../types";
import { TaskCard } from "./task-card";

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: Task["status"]) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

function TaskSkeleton() {
  return (
    <GlassCard padding="sm" className="flex items-start gap-3">
      <Skeleton className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4 rounded" />
        <Skeleton className="h-3 w-1/2 rounded" />
      </div>
    </GlassCard>
  );
}

export function TaskList({
  tasks,
  isLoading,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskListProps): React.ReactElement {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <TaskSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <GlassCard variant="subtle" className="flex flex-col items-center justify-center gap-3 py-14">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <ClipboardList size={28} className="text-primary" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium">No tasks yet</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Add a task to start planning your day.
          </p>
        </div>
      </GlassCard>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-3"
    >
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
