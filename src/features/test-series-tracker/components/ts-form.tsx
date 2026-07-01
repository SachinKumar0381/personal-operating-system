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
  createTestSeriesSchema,
  TS_STATUSES,
  TS_PRIORITIES,
  TS_MODULES,
  type CreateTestSeriesInput,
} from "@/features/test-series-tracker/schemas/test-series-schema";
import type { TestSeriesEntry } from "@/features/test-series-tracker/types";

interface TsFormProps {
  onSubmit: (data: CreateTestSeriesInput) => void;
  onCancel?: () => void;
  editEntry?: TestSeriesEntry | null;
  isLoading?: boolean;
}

function FieldLabel({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{children}</label>
  );
}

function SelectField({
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { className?: string }): React.ReactElement {
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

export function TsForm({
  onSubmit,
  onCancel,
  editEntry,
  isLoading,
}: TsFormProps): React.ReactElement {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTestSeriesInput>({
    resolver: zodResolver(createTestSeriesSchema),
    defaultValues: {
      status: "not_started",
      priority: "medium",
    },
  });

  useEffect(() => {
    if (editEntry) {
      reset({
        module: editEntry.module,
        status: editEntry.status,
        priority: editEntry.priority,
        notes: editEntry.notes ?? undefined,
      });
    } else {
      reset({ status: "not_started", priority: "medium" });
    }
  }, [editEntry, reset]);

  function handleFormSubmit(data: CreateTestSeriesInput): void {
    onSubmit(data);
    if (!editEntry) {
      reset({ status: "not_started", priority: "medium" });
    }
  }

  const isEditing = !!editEntry;

  return (
    <GlassCard variant="elevated" padding="md">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium">{isEditing ? "Edit Module" : "Add Module"}</p>
        {onCancel && (
          <GlassButton size="icon" variant="ghost" className="h-7 w-7" onClick={onCancel}>
            <X size={14} />
          </GlassButton>
        )}
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <FieldLabel>Module Name *</FieldLabel>
          <GlassInput
            list="ts-modules-list"
            placeholder="e.g. Question Bank"
            error={!!errors.module}
            {...register("module")}
          />
          <datalist id="ts-modules-list">
            {TS_MODULES.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
          {errors.module && (
            <p className="mt-1 text-xs text-destructive">{errors.module.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Status *</FieldLabel>
            <SelectField {...register("status")}>
              {TS_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </option>
              ))}
            </SelectField>
          </div>

          <div>
            <FieldLabel>Priority *</FieldLabel>
            <SelectField {...register("priority")}>
              {TS_PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </SelectField>
          </div>
        </div>

        <div>
          <FieldLabel>Notes</FieldLabel>
          <GlassInput placeholder="Optional notes..." {...register("notes")} />
        </div>

        <div className="flex gap-2">
          <GlassButton type="submit" variant="primary" className="flex-1" disabled={isLoading}>
            {isLoading ? "Saving…" : isEditing ? "Update Module" : "Add Module"}
          </GlassButton>
          {onCancel && (
            <GlassButton type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </GlassButton>
          )}
        </div>
      </form>
    </GlassCard>
  );
}
