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
  createJobSchema,
  JOB_STATUSES,
  type CreateJobInput,
} from "@/features/job-tracker/schemas/job-schema";
import type { JobApplication } from "@/features/job-tracker/types";
import { format } from "date-fns";

interface JobFormProps {
  onSubmit: (data: CreateJobInput) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  editJob?: JobApplication | null;
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

const STATUS_LABELS: Record<string, string> = {
  applied: "Applied",
  screening: "Screening",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

const TODAY = format(new Date(), "yyyy-MM-dd");

export function JobForm({
  onSubmit,
  onCancel,
  isLoading,
  editJob,
}: JobFormProps): React.ReactElement {
  const isEditing = !!editJob;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateJobInput>({
    resolver: zodResolver(createJobSchema),
    defaultValues: { status: "applied", appliedAt: TODAY },
  });

  useEffect(() => {
    if (editJob) {
      reset({
        company: editJob.company,
        role: editJob.role,
        status: editJob.status,
        salaryRange: editJob.salaryRange ?? "",
        jobUrl: editJob.jobUrl ?? "",
        notes: editJob.notes ?? "",
        appliedAt: format(new Date(editJob.appliedAt), "yyyy-MM-dd"),
        followUpAt: editJob.followUpAt
          ? format(new Date(editJob.followUpAt), "yyyy-MM-dd")
          : "",
      });
    } else {
      reset({ status: "applied", appliedAt: TODAY });
    }
  }, [editJob, reset]);

  function handleFormSubmit(data: CreateJobInput) {
    onSubmit(data);
    if (!isEditing) reset({ status: "applied", appliedAt: TODAY });
  }

  return (
    <GlassCard variant="elevated" padding="md">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium">
          {isEditing ? "Edit Application" : "Add Application"}
        </p>
        {isEditing && onCancel && (
          <GlassButton size="icon" variant="ghost" onClick={onCancel} className="h-7 w-7">
            <X size={14} />
          </GlassButton>
        )}
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <FieldLabel>Company *</FieldLabel>
            <GlassInput
              placeholder="e.g. Google"
              error={!!errors.company}
              {...register("company")}
            />
            {errors.company && (
              <p className="mt-1 text-xs text-destructive">{errors.company.message}</p>
            )}
          </div>
          <div>
            <FieldLabel>Role *</FieldLabel>
            <GlassInput
              placeholder="e.g. Software Engineer"
              error={!!errors.role}
              {...register("role")}
            />
            {errors.role && (
              <p className="mt-1 text-xs text-destructive">{errors.role.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <FieldLabel>Status *</FieldLabel>
            <SelectField {...register("status")}>
              {JOB_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </SelectField>
          </div>
          <div>
            <FieldLabel>Salary Range</FieldLabel>
            <GlassInput
              placeholder="e.g. 12-15 LPA"
              {...register("salaryRange")}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <FieldLabel>Applied Date *</FieldLabel>
            <GlassInput
              type="date"
              error={!!errors.appliedAt}
              {...register("appliedAt")}
            />
            {errors.appliedAt && (
              <p className="mt-1 text-xs text-destructive">{errors.appliedAt.message}</p>
            )}
          </div>
          <div>
            <FieldLabel>Follow-up Date</FieldLabel>
            <GlassInput type="date" {...register("followUpAt")} />
          </div>
        </div>

        <div>
          <FieldLabel>Job URL</FieldLabel>
          <GlassInput
            placeholder="https://careers.company.com/..."
            error={!!errors.jobUrl}
            {...register("jobUrl")}
          />
          {errors.jobUrl && (
            <p className="mt-1 text-xs text-destructive">{errors.jobUrl.message}</p>
          )}
        </div>

        <div>
          <FieldLabel>Notes</FieldLabel>
          <TextareaField
            placeholder="Recruiter contact, requirements, preparation notes..."
            {...register("notes")}
          />
        </div>

        <div className="flex gap-2">
          <GlassButton type="submit" variant="primary" className="flex-1" disabled={isLoading}>
            {isLoading ? "Saving…" : isEditing ? "Update Application" : "Add Application"}
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
