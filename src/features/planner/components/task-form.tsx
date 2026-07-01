"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { X } from "lucide-react";
import { format } from "date-fns";
import { GlassCard } from "@/shared/ui/glass-card";
import { GlassButton } from "@/shared/ui/glass-button";
import { GlassInput } from "@/shared/ui/glass-input";
import { cn } from "@/shared/utils/cn";
import {
  createTaskSchema,
  TASK_CATEGORIES,
  TASK_PRIORITIES,
  TASK_STATUSES,
  type CreateTaskInput,
} from "../schemas/task-schema";
import type { Task } from "../types";

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskInput) => void;
  editTask?: Task | null;
  defaultDate: Date;
  isLoading?: boolean;
}

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

const panelVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.96, y: 8, transition: { duration: 0.15 } },
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{children}</label>
  );
}

function SelectField({
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { className?: string }) {
  return (
    <select
      className={cn(
        "flex h-10 w-full rounded-xl px-3 py-2 text-sm",
        "bg-white/10 dark:bg-white/5 backdrop-blur-sm",
        "border border-white/20 dark:border-white/10",
        "text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
        "transition-all duration-200",
        className
      )}
      {...props}
    />
  );
}

export function TaskForm({
  open,
  onClose,
  onSubmit,
  editTask,
  defaultDate,
  isLoading,
}: TaskFormProps): React.ReactElement {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium" as const,
      status: "todo" as const,
      date: format(defaultDate, "yyyy-MM-dd"),
      tags: [] as string[],
    },
  });

  useEffect(() => {
    if (editTask) {
      reset({
        title: editTask.title,
        description: editTask.description ?? "",
        category: (editTask.category as CreateTaskInput["category"]) ?? undefined,
        priority: editTask.priority,
        status: editTask.status,
        date: format(new Date(editTask.date), "yyyy-MM-dd"),
        startTime: editTask.startTime ?? "",
        endTime: editTask.endTime ?? "",
        tags: editTask.tags,
      });
    } else {
      reset({
        title: "",
        description: "",
        priority: "medium",
        status: "todo",
        date: format(defaultDate, "yyyy-MM-dd"),
        tags: [],
      });
    }
  }, [editTask, defaultDate, reset]);

  function handleFormSubmit(data: CreateTaskInput) {
    const cleaned: CreateTaskInput = {
      ...data,
      description: data.description || undefined,
      startTime: data.startTime || undefined,
      endTime: data.endTime || undefined,
    };
    onSubmit(cleaned);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="show"
          exit="hidden"
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            className="relative z-10 w-full max-w-md"
            variants={panelVariants}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <GlassCard variant="elevated" padding="lg" className="shadow-2xl">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-base font-semibold">
                  {editTask ? "Edit Task" : "New Task"}
                </h2>
                <GlassButton size="icon" variant="ghost" className="h-8 w-8" onClick={onClose}>
                  <X size={16} />
                </GlassButton>
              </div>

              <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                <div>
                  <FieldLabel>Title *</FieldLabel>
                  <GlassInput
                    {...register("title")}
                    placeholder="What needs to be done?"
                    error={!!errors.title}
                    autoFocus
                  />
                  {errors.title && (
                    <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <FieldLabel>Description</FieldLabel>
                  <textarea
                    {...register("description")}
                    placeholder="Add details..."
                    rows={2}
                    className={cn(
                      "flex w-full rounded-xl px-3 py-2 text-sm",
                      "bg-white/10 dark:bg-white/5 backdrop-blur-sm",
                      "border border-white/20 dark:border-white/10",
                      "text-foreground placeholder:text-muted-foreground",
                      "focus:outline-none focus:ring-2 focus:ring-ring",
                      "resize-none transition-all duration-200"
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <FieldLabel>Priority</FieldLabel>
                    <SelectField {...register("priority")}>
                      {TASK_PRIORITIES.map((p) => (
                        <option key={p} value={p}>
                          {p.charAt(0).toUpperCase() + p.slice(1)}
                        </option>
                      ))}
                    </SelectField>
                  </div>
                  <div>
                    <FieldLabel>Status</FieldLabel>
                    <SelectField {...register("status")}>
                      {TASK_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s === "in_progress" ? "In Progress" : s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </SelectField>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <FieldLabel>Category</FieldLabel>
                    <SelectField {...register("category")}>
                      <option value="">None</option>
                      {TASK_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c.charAt(0).toUpperCase() + c.slice(1)}
                        </option>
                      ))}
                    </SelectField>
                  </div>
                  <div>
                    <FieldLabel>Date</FieldLabel>
                    <GlassInput
                      type="date"
                      {...register("date")}
                      error={!!errors.date}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <FieldLabel>Start Time</FieldLabel>
                    <GlassInput type="time" {...register("startTime")} />
                  </div>
                  <div>
                    <FieldLabel>End Time</FieldLabel>
                    <GlassInput type="time" {...register("endTime")} />
                  </div>
                </div>

                <div className="flex gap-3 pt-1">
                  <GlassButton
                    type="button"
                    variant="ghost"
                    className="flex-1"
                    onClick={onClose}
                  >
                    Cancel
                  </GlassButton>
                  <GlassButton
                    type="submit"
                    variant="primary"
                    className="flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving…" : editTask ? "Save Changes" : "Create Task"}
                  </GlassButton>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
