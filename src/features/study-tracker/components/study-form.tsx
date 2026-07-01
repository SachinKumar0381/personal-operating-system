"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { GlassCard } from "@/shared/ui/glass-card";
import { GlassButton } from "@/shared/ui/glass-button";
import { GlassInput } from "@/shared/ui/glass-input";
import { cn } from "@/shared/utils/cn";
import {
  createStudySchema,
  STUDY_SUBJECTS,
  type CreateStudyInput,
} from "@/features/study-tracker/schemas/study-schema";

interface StudyFormProps {
  onSubmit: (data: CreateStudyInput) => void;
  isLoading?: boolean;
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

export function StudyForm({ onSubmit, isLoading }: StudyFormProps): React.ReactElement {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateStudyInput>({
    resolver: zodResolver(createStudySchema),
    defaultValues: {
      subject: "JavaScript",
      date: format(new Date(), "yyyy-MM-dd"),
    },
  });

  function handleFormSubmit(data: CreateStudyInput) {
    onSubmit(data);
    reset({
      subject: data.subject,
      date: format(new Date(), "yyyy-MM-dd"),
      topic: "",
      duration: undefined as unknown as number,
      notes: "",
      resources: "",
    });
  }

  return (
    <GlassCard variant="elevated" padding="md">
      <p className="mb-4 text-sm font-medium">Log Study Session</p>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Subject *</FieldLabel>
            <SelectField {...register("subject")}>
              {STUDY_SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </SelectField>
            {errors.subject && (
              <p className="mt-1 text-xs text-destructive">{errors.subject.message}</p>
            )}
          </div>
          <div>
            <FieldLabel>Duration (minutes) *</FieldLabel>
            <GlassInput
              type="number"
              min="1"
              placeholder="e.g. 60"
              error={!!errors.duration}
              {...register("duration", { valueAsNumber: true })}
            />
            {errors.duration && (
              <p className="mt-1 text-xs text-destructive">{errors.duration.message}</p>
            )}
          </div>
        </div>

        <div>
          <FieldLabel>Topic *</FieldLabel>
          <GlassInput
            placeholder="e.g. React hooks, useEffect deep dive"
            error={!!errors.topic}
            {...register("topic")}
          />
          {errors.topic && (
            <p className="mt-1 text-xs text-destructive">{errors.topic.message}</p>
          )}
        </div>

        <div>
          <FieldLabel>Date *</FieldLabel>
          <GlassInput type="date" error={!!errors.date} {...register("date")} />
          {errors.date && (
            <p className="mt-1 text-xs text-destructive">{errors.date.message}</p>
          )}
        </div>

        <div>
          <FieldLabel>Resources (comma-separated URLs or names)</FieldLabel>
          <GlassInput
            placeholder="e.g. MDN docs, YouTube, Udemy course"
            {...register("resources")}
          />
        </div>

        <div>
          <FieldLabel>Notes</FieldLabel>
          <TextareaField placeholder="What did you learn? Key takeaways..." {...register("notes")} />
        </div>

        <GlassButton type="submit" variant="primary" className="w-full" disabled={isLoading}>
          {isLoading ? "Saving…" : "Log Session"}
        </GlassButton>
      </form>
    </GlassCard>
  );
}
