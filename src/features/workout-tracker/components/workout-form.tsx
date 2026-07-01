"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { GlassCard } from "@/shared/ui/glass-card";
import { GlassButton } from "@/shared/ui/glass-button";
import { GlassInput } from "@/shared/ui/glass-input";
import { cn } from "@/shared/utils/cn";
import {
  createWorkoutSchema,
  WORKOUT_TYPES,
  type CreateWorkoutInput,
  type ExerciseInput,
} from "@/features/workout-tracker/schemas/workout-schema";

interface WorkoutFormProps {
  onSubmit: (data: CreateWorkoutInput) => void;
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
}: React.SelectHTMLAttributes<HTMLSelectElement>): React.ReactElement {
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

export function WorkoutForm({ onSubmit, isLoading }: WorkoutFormProps): React.ReactElement {
  const [showExercises, setShowExercises] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateWorkoutInput>({
    resolver: zodResolver(createWorkoutSchema),
    defaultValues: {
      type: "strength",
      date: format(new Date(), "yyyy-MM-dd"),
      exercises: [] as ExerciseInput[],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "exercises",
  });

  function handleFormSubmit(data: CreateWorkoutInput): void {
    onSubmit(data);
    reset({
      type: data.type,
      date: format(new Date(), "yyyy-MM-dd"),
      exercises: [] as ExerciseInput[],
    });
    setShowExercises(false);
  }

  function addExercise(): void {
    append({ name: "" });
  }

  return (
    <GlassCard variant="elevated" padding="md">
      <p className="mb-4 text-sm font-medium">Log Workout</p>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <FieldLabel>Workout Name *</FieldLabel>
          <GlassInput
            placeholder="e.g. Morning Push Day"
            error={!!errors.name}
            {...register("name")}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        {/* Type + Duration */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Type</FieldLabel>
            <SelectField {...register("type")}>
              {WORKOUT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </SelectField>
          </div>
          <div>
            <FieldLabel>Duration (mins) *</FieldLabel>
            <GlassInput
              type="number"
              placeholder="e.g. 45"
              error={!!errors.duration}
              {...register("duration", { valueAsNumber: true })}
            />
            {errors.duration && (
              <p className="mt-1 text-xs text-destructive">{errors.duration.message}</p>
            )}
          </div>
        </div>

        {/* Date */}
        <div>
          <FieldLabel>Date *</FieldLabel>
          <GlassInput type="date" error={!!errors.date} {...register("date")} />
          {errors.date && (
            <p className="mt-1 text-xs text-destructive">{errors.date.message}</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <FieldLabel>Notes</FieldLabel>
          <GlassInput placeholder="Optional notes…" {...register("notes")} />
        </div>

        {/* Exercises collapsible */}
        <div>
          <button
            type="button"
            onClick={() => setShowExercises((v) => !v)}
            className="flex w-full items-center justify-between rounded-xl border border-white/20 px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-white/10 dark:border-white/10 dark:hover:bg-white/5"
          >
            <span>
              Exercises
              <span className="ml-1 text-xs opacity-60">({fields.length} added)</span>
            </span>
            {showExercises ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showExercises && (
            <div className="mt-3 space-y-3">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="space-y-2 rounded-xl border border-white/15 bg-white/5 p-3 dark:border-white/8 dark:bg-white/3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-muted-foreground">
                      Exercise {index + 1}
                    </p>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-muted-foreground transition-colors hover:text-destructive"
                      aria-label="Remove exercise"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <GlassInput
                    placeholder="Exercise name *"
                    {...register(`exercises.${index}.name`)}
                  />

                  <div className="grid grid-cols-3 gap-2">
                    <GlassInput
                      type="number"
                      placeholder="Sets"
                      {...register(`exercises.${index}.sets`, { valueAsNumber: true })}
                    />
                    <GlassInput
                      type="number"
                      placeholder="Reps"
                      {...register(`exercises.${index}.reps`, { valueAsNumber: true })}
                    />
                    <GlassInput
                      type="number"
                      step="0.5"
                      placeholder="kg"
                      {...register(`exercises.${index}.weight`, { valueAsNumber: true })}
                    />
                  </div>
                </div>
              ))}

              <GlassButton
                type="button"
                variant="outline"
                size="sm"
                className="w-full gap-1.5"
                onClick={addExercise}
              >
                <Plus size={14} />
                Add Exercise
              </GlassButton>
            </div>
          )}
        </div>

        <GlassButton type="submit" variant="primary" className="w-full" disabled={isLoading}>
          {isLoading ? "Saving…" : "Log Workout"}
        </GlassButton>
      </form>
    </GlassCard>
  );
}
