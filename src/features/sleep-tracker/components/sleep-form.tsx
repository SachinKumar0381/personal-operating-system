"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, addDays } from "date-fns";
import { GlassCard } from "@/shared/ui/glass-card";
import { GlassButton } from "@/shared/ui/glass-button";
import { GlassInput } from "@/shared/ui/glass-input";
import { cn } from "@/shared/utils/cn";
import {
  createSleepSchema,
  SLEEP_QUALITY,
  type CreateSleepInput,
} from "@/features/sleep-tracker/schemas/sleep-schema";

interface SleepFormProps {
  onSubmit: (data: CreateSleepInput) => void;
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

const qualityLabels: Record<number, string> = {
  1: "Very Poor",
  2: "Poor",
  3: "Fair",
  4: "Good",
  5: "Excellent",
};

const DEFAULT_QUALITY = 3;

export function SleepForm({ onSubmit, isLoading }: SleepFormProps): React.ReactElement {
  const todayDate = format(new Date(), "yyyy-MM-dd");
  const defaultBedTime = `${todayDate}T23:00`;
  const tomorrowDate = format(addDays(new Date(), 1), "yyyy-MM-dd");
  const defaultWakeTime = `${tomorrowDate}T07:00`;

  const [selectedQuality, setSelectedQuality] = useState<number>(DEFAULT_QUALITY);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateSleepInput>({
    resolver: zodResolver(createSleepSchema),
    defaultValues: {
      bedTime: defaultBedTime,
      wakeTime: defaultWakeTime,
      quality: DEFAULT_QUALITY,
      date: todayDate,
    },
  });

  function handleQualitySelect(q: number) {
    setSelectedQuality(q);
    setValue("quality", q);
  }

  function handleFormSubmit(data: CreateSleepInput) {
    onSubmit(data);
    setSelectedQuality(DEFAULT_QUALITY);
    reset({
      bedTime: defaultBedTime,
      wakeTime: defaultWakeTime,
      quality: DEFAULT_QUALITY,
      date: todayDate,
    });
  }

  return (
    <GlassCard variant="elevated" padding="md">
      <p className="mb-4 text-sm font-medium">Log Sleep</p>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel required>Bed Time</FieldLabel>
            <GlassInput
              type="datetime-local"
              error={!!errors.bedTime}
              {...register("bedTime")}
            />
            {errors.bedTime && (
              <p className="mt-1 text-xs text-destructive">{errors.bedTime.message}</p>
            )}
          </div>
          <div>
            <FieldLabel required>Wake Time</FieldLabel>
            <GlassInput
              type="datetime-local"
              error={!!errors.wakeTime}
              {...register("wakeTime")}
            />
            {errors.wakeTime && (
              <p className="mt-1 text-xs text-destructive">{errors.wakeTime.message}</p>
            )}
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
          <FieldLabel required>Sleep Quality</FieldLabel>
          <div className="flex items-center gap-2">
            {SLEEP_QUALITY.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleQualitySelect(q)}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium transition-all duration-200",
                  "border backdrop-blur-sm",
                  selectedQuality === q
                    ? "border-primary/50 bg-primary/20 text-primary"
                    : "border-white/20 bg-white/10 text-muted-foreground hover:bg-white/20 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                )}
              >
                {q}
              </button>
            ))}
            {selectedQuality && (
              <span className="ml-1 text-xs text-muted-foreground">
                {qualityLabels[selectedQuality]}
              </span>
            )}
          </div>
          {errors.quality && (
            <p className="mt-1 text-xs text-destructive">{errors.quality.message}</p>
          )}
        </div>

        <div>
          <FieldLabel>Notes</FieldLabel>
          <GlassInput placeholder="How did you sleep?" {...register("notes")} />
        </div>

        <GlassButton type="submit" variant="primary" className="w-full" disabled={isLoading}>
          {isLoading ? "Saving…" : "Log Sleep"}
        </GlassButton>
      </form>
    </GlassCard>
  );
}
