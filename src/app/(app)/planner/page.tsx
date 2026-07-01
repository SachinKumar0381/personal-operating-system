"use client";

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Filter } from "lucide-react";
import { format } from "date-fns";
import { GlassCard } from "@/shared/ui/glass-card";
import { GlassButton } from "@/shared/ui/glass-button";
import { useTasks } from "@/features/planner/hooks/use-tasks";
import { useTaskMutations } from "@/features/planner/hooks/use-task-mutations";
import { DateNavigator } from "@/features/planner/components/date-navigator";
import { TaskFilters } from "@/features/planner/components/task-filters";
import { TaskList } from "@/features/planner/components/task-list";
import { TaskForm } from "@/features/planner/components/task-form";
import type { Task, TaskFiltersState } from "@/features/planner/types";
import type { CreateTaskInput } from "@/features/planner/schemas/task-schema";

const DEFAULT_FILTERS: TaskFiltersState = {
  category: "all",
  priority: "all",
  status: "all",
};

export default function PlannerPage(): React.ReactElement {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [formOpen, setFormOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<TaskFiltersState>(DEFAULT_FILTERS);

  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const { data: tasks = [], isLoading } = useTasks(dateStr);
  const { createTask, updateTask, deleteTask } = useTaskMutations(dateStr);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (filters.priority !== "all" && t.priority !== filters.priority) return false;
      if (filters.status !== "all" && t.status !== filters.status) return false;
      if (filters.category !== "all" && t.category !== filters.category) return false;
      return true;
    });
  }, [tasks, filters]);

  const completedCount = tasks.filter((t) => t.status === "done").length;

  const handleOpenCreate = useCallback(() => {
    setEditTask(null);
    setFormOpen(true);
  }, []);

  const handleOpenEdit = useCallback((task: Task) => {
    setEditTask(task);
    setFormOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setFormOpen(false);
    setEditTask(null);
  }, []);

  const handleSubmit = useCallback(
    (data: CreateTaskInput) => {
      if (editTask) {
        updateTask.mutate(
          { taskId: editTask.id, data },
          { onSuccess: handleClose }
        );
      } else {
        createTask.mutate(data, { onSuccess: handleClose });
      }
    },
    [editTask, createTask, updateTask, handleClose]
  );

  const handleStatusChange = useCallback(
    (taskId: string, status: Task["status"]) => {
      updateTask.mutate({ taskId, data: { status } });
    },
    [updateTask]
  );

  const handleDelete = useCallback(
    (taskId: string) => {
      deleteTask.mutate(taskId);
    },
    [deleteTask]
  );

  const isMutating = createTask.isPending || updateTask.isPending;

  return (
    <>
      <TaskForm
        open={formOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        editTask={editTask}
        defaultDate={selectedDate}
        isLoading={isMutating}
      />

      <div className="space-y-5">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <GlassCard variant="elevated" padding="md">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-lg font-semibold">Daily Planner</h1>
                <p className="text-xs text-muted-foreground">
                  {tasks.length > 0
                    ? `${completedCount} of ${tasks.length} tasks completed`
                    : "No tasks for this day"}
                </p>
              </div>
              <DateNavigator date={selectedDate} onDateChange={setSelectedDate} />
            </div>

            {tasks.length > 0 && (
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10 dark:bg-white/5">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0}%`,
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            )}
          </GlassCard>
        </motion.div>

        <div className="flex items-center justify-between">
          <GlassButton
            size="sm"
            variant="ghost"
            onClick={() => setShowFilters((v) => !v)}
            className="gap-1.5"
          >
            <Filter size={14} />
            Filters
            {(filters.priority !== "all" || filters.status !== "all" || filters.category !== "all") && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                !
              </span>
            )}
          </GlassButton>

          <GlassButton size="sm" variant="primary" onClick={handleOpenCreate} className="gap-1.5">
            <Plus size={14} />
            Add Task
          </GlassButton>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <GlassCard padding="md">
              <TaskFilters
                filters={filters}
                onChange={setFilters}
                taskCount={filteredTasks.length}
              />
            </GlassCard>
          </motion.div>
        )}

        <TaskList
          tasks={filteredTasks}
          isLoading={isLoading}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      </div>
    </>
  );
}
