"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { GlassCard } from "@/shared/ui/glass-card";
import { GlassButton } from "@/shared/ui/glass-button";
import { GlassInput } from "@/shared/ui/glass-input";
import { cn } from "@/shared/utils/cn";
import {
  createSmokingSchema,
  MOOD_OPTIONS,
  TRIGGER_OPTIONS,
  type CreateSmokingInput,
  type MoodOption,
  type TriggerOption,
} from "@/features/smoking-tracker/schemas/smoking-schema";

interface SmokingFormProps {
  onSubmit: (data: CreateSmokingInput) => void;
  isLoading?: boolean;
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
      {children}
      {required && <span className="ml-0.5 text-destructive">*</span>}
    </label>
  );
}

const moodLabels: Record<MoodOption, string> = {
  great: "😊 Great",
  good: "🙂 Good",
  neutral: "😐 Neutral",
  stressed: "😤 Stressed",
  anxious: "😰 Anxious",
  angry: "😠 Angry",
};

const triggerLabels: Record<TriggerOption, string> = {
  stress: "Stress",
  boredom: "Boredom",
  social: "Social",
  after_meal: "After meal",
  coffee: "Coffee",
  alcohol: "Alcohol",
  habit: "Habit",
  other: "Other",
};

export function SmokingForm({ onSubmit, isLoading }: SmokingFormProps): React.ReactElement {
  const todayDate = format(new Date(), "yyyy-MM-dd");
  const [selectedMood, setSelectedMood] = useState<MoodOption | undefined>();
  const [selectedTrigger, setSelectedTrigger] = useState<TriggerOption | undefined>();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateSmokingInput>({
    resolver: zodResolver(createSmokingSchema),
    defaultValues: {
      cigarettesSmoked: 0,
      cravings: 0,
      date: todayDate,
    },
  });

  function selectMood(mood: MoodOption) {
    const next = selectedMood === mood ? undefined : mood;
    setSelectedMood(next);
    setValue("mood", next);
  }

  function selectTrigger(trigger: TriggerOption) {
    const next = selectedTrigger === trigger ? undefined : trigger;
    setSelectedTrigger(next);
    setValue("trigger", next);
  }

  function handleFormSubmit(data: CreateSmokingInput) {
    onSubmit(data);
    setSelectedMood(undefined);
    setSelectedTrigger(undefined);
    reset({ cigarettesSmoked: 0, cravings: 0, date: todayDate });
  }

  return (
    <GlassCard variant="elevated" padding="md">
      <p className="mb-4 text-sm font-medium">Log Today&apos;s Smoking</p>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">

        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel required>Cigarettes Smoked</FieldLabel>
            <Controller
              name="cigarettesSmoked"
              control={control}
              render={({ field }) => (
                <GlassInput
                  type="number"
                  min={0}
                  max={100}
                  placeholder="0"
                  error={!!errors.cigarettesSmoked}
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                />
              )}
            />
            {errors.cigarettesSmoked && (
              <p className="mt-1 text-xs text-destructive">{errors.cigarettesSmoked.message}</p>
            )}
          </div>

          <div>
            <FieldLabel required>Cravings Resisted</FieldLabel>
            <Controller
              name="cravings"
              control={control}
              render={({ field }) => (
                <GlassInput
                  type="number"
                  min={0}
                  max={50}
                  placeholder="0"
                  error={!!errors.cravings}
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                />
              )}
            />
            {errors.cravings && (
              <p className="mt-1 text-xs text-destructive">{errors.cravings.message}</p>
            )}
          </div>
        </div>

        <div>
          <FieldLabel>How are you feeling?</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {MOOD_OPTIONS.map((mood) => (
              <button
                key={mood}
                type="button"
                onClick={() => selectMood(mood)}
                className={cn(
                  "rounded-xl border px-3 py-1.5 text-xs font-medium backdrop-blur-sm transition-all duration-200",
                  selectedMood === mood
                    ? "border-primary/30 bg-primary/15 text-primary"
                    : "border-white/20 bg-white/10 text-muted-foreground hover:bg-white/20 dark:border-white/10 dark:bg-white/5"
                )}
              >
                {moodLabels[mood]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <FieldLabel>Main Trigger</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {TRIGGER_OPTIONS.map((trigger) => (
              <button
                key={trigger}
                type="button"
                onClick={() => selectTrigger(trigger)}
                className={cn(
                  "rounded-xl border px-3 py-1.5 text-xs font-medium backdrop-blur-sm transition-all duration-200",
                  selectedTrigger === trigger
                    ? "border-orange-500/30 bg-orange-500/15 text-orange-600 dark:text-orange-400"
                    : "border-white/20 bg-white/10 text-muted-foreground hover:bg-white/20 dark:border-white/10 dark:bg-white/5"
                )}
              >
                {triggerLabels[trigger]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <FieldLabel required>Date</FieldLabel>
          <GlassInput type="date" error={!!errors.date} {...register("date")} />
          {errors.date && (
            <p className="mt-1 text-xs text-destructive">{errors.date.message}</p>
          )}
        </div>

        <div>
          <FieldLabel>Notes</FieldLabel>
          <GlassInput
            placeholder="Any thoughts or observations for today?"
            {...register("notes")}
          />
        </div>

        <GlassButton type="submit" variant="primary" className="w-full" disabled={isLoading}>
          {isLoading ? "Saving…" : "Log Entry"}
        </GlassButton>
      </form>
    </GlassCard>
  );
}
