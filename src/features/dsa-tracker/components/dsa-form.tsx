"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { GlassCard } from "@/shared/ui/glass-card";
import { GlassButton } from "@/shared/ui/glass-button";
import { GlassInput } from "@/shared/ui/glass-input";
import { cn } from "@/shared/utils/cn";
import {
  createDsaSchema,
  DSA_PLATFORMS,
  DSA_DIFFICULTIES,
  DSA_CATEGORIES,
  DSA_STATUSES,
  type CreateDsaInput,
} from "@/features/dsa-tracker/schemas/dsa-schema";
import type { DsaProblem } from "@/features/dsa-tracker/types";

interface DsaFormProps {
  onSubmit: (data: CreateDsaInput) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  editProblem?: DsaProblem | null;
}

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

function TextareaField({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { className?: string }) {
  return (
    <textarea
      rows={3}
      className={cn(
        "flex w-full rounded-xl px-3 py-2 text-sm",
        "bg-white/10 dark:bg-white/5 backdrop-blur-sm",
        "border border-white/20 dark:border-white/10",
        "text-foreground placeholder:text-muted-foreground",
        "focus:outline-none focus:ring-2 focus:ring-ring",
        "resize-none transition-all duration-200",
        className
      )}
      {...props}
    />
  );
}

export function DsaForm({ onSubmit, onCancel, isLoading, editProblem }: DsaFormProps): React.ReactElement {
  const isEditing = !!editProblem;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateDsaInput>({
    resolver: zodResolver(createDsaSchema),
    defaultValues: {
      platform: "LeetCode",
      difficulty: "Medium",
      category: "Arrays",
      status: "solved",
    },
  });

  useEffect(() => {
    if (editProblem) {
      reset({
        title: editProblem.title,
        platform: editProblem.platform,
        difficulty: editProblem.difficulty,
        category: editProblem.category,
        status: editProblem.status,
        url: editProblem.url ?? "",
        notes: editProblem.notes ?? "",
        timeComplexity: editProblem.timeComplexity ?? "",
        spaceComplexity: editProblem.spaceComplexity ?? "",
      });
    } else {
      reset({
        platform: "LeetCode",
        difficulty: "Medium",
        category: "Arrays",
        status: "solved",
        title: "",
        url: "",
        notes: "",
        timeComplexity: "",
        spaceComplexity: "",
      });
    }
  }, [editProblem, reset]);

  function handleFormSubmit(data: CreateDsaInput) {
    onSubmit(data);
    if (!isEditing) {
      reset({
        platform: "LeetCode",
        difficulty: "Medium",
        category: "Arrays",
        status: "solved",
        title: "",
        url: "",
        notes: "",
        timeComplexity: "",
        spaceComplexity: "",
      });
    }
  }

  return (
    <GlassCard variant="elevated" padding="md">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium">{isEditing ? "Edit Problem" : "Add Problem"}</p>
        {isEditing && onCancel && (
          <GlassButton size="icon" variant="ghost" onClick={onCancel} className="h-7 w-7">
            <X size={14} />
          </GlassButton>
        )}
      </div>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <FieldLabel>Problem Title *</FieldLabel>
          <GlassInput
            placeholder="e.g. Two Sum"
            error={!!errors.title}
            {...register("title")}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Platform *</FieldLabel>
            <SelectField {...register("platform")}>
              {DSA_PLATFORMS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </SelectField>
          </div>
          <div>
            <FieldLabel>Difficulty *</FieldLabel>
            <SelectField {...register("difficulty")}>
              {DSA_DIFFICULTIES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </SelectField>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Category *</FieldLabel>
            <SelectField {...register("category")}>
              {DSA_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </SelectField>
          </div>
          <div>
            <FieldLabel>Status *</FieldLabel>
            <SelectField {...register("status")}>
              {DSA_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s === "solved" ? "Solved" : s === "attempted" ? "Attempted" : "Revisit"}
                </option>
              ))}
            </SelectField>
          </div>
        </div>

        <div>
          <FieldLabel>Problem URL</FieldLabel>
          <GlassInput
            placeholder="https://leetcode.com/problems/two-sum"
            error={!!errors.url}
            {...register("url")}
          />
          {errors.url && (
            <p className="mt-1 text-xs text-destructive">{errors.url.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Time Complexity</FieldLabel>
            <GlassInput placeholder="e.g. O(n)" {...register("timeComplexity")} />
          </div>
          <div>
            <FieldLabel>Space Complexity</FieldLabel>
            <GlassInput placeholder="e.g. O(1)" {...register("spaceComplexity")} />
          </div>
        </div>

        <div>
          <FieldLabel>Notes</FieldLabel>
          <TextareaField
            placeholder="Approach, key observations, edge cases..."
            {...register("notes")}
          />
        </div>

        <div className="flex gap-2">
          <GlassButton type="submit" variant="primary" className="flex-1" disabled={isLoading}>
            {isLoading ? "Saving…" : isEditing ? "Update Problem" : "Add Problem"}
          </GlassButton>
          {isEditing && onCancel && (
            <GlassButton type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </GlassButton>
          )}
        </div>
      </form>
    </GlassCard>
  );
}
