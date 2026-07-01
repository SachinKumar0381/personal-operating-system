"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { GlassCard } from "@/shared/ui/glass-card";
import { GlassButton } from "@/shared/ui/glass-button";
import { GlassInput } from "@/shared/ui/glass-input";
import { cn } from "@/shared/utils/cn";
import {
  createWeightSchema,
  WEIGHT_UNITS,
  type CreateWeightInput,
} from "@/features/weight-tracker/schemas/weight-schema";

interface WeightFormProps {
  onSubmit: (data: CreateWeightInput) => void;
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

export function WeightForm({ onSubmit, isLoading }: WeightFormProps): React.ReactElement {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateWeightInput>({
    resolver: zodResolver(createWeightSchema),
    defaultValues: {
      unit: "kg",
      date: format(new Date(), "yyyy-MM-dd"),
    },
  });

  function handleFormSubmit(data: CreateWeightInput) {
    onSubmit(data);
    reset({ unit: data.unit, date: format(new Date(), "yyyy-MM-dd"), weight: undefined as unknown as number });
  }

  return (
    <GlassCard variant="elevated" padding="md">
      <p className="mb-4 text-sm font-medium">Log Weight</p>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Weight *</FieldLabel>
            <GlassInput
              type="number"
              step="0.1"
              placeholder="e.g. 72.5"
              error={!!errors.weight}
              {...register("weight", { valueAsNumber: true })}
            />
            {errors.weight && (
              <p className="mt-1 text-xs text-destructive">{errors.weight.message}</p>
            )}
          </div>
          <div>
            <FieldLabel>Unit</FieldLabel>
            <SelectField {...register("unit")}>
              {WEIGHT_UNITS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </SelectField>
          </div>
        </div>

        <div>
          <FieldLabel>Date *</FieldLabel>
          <GlassInput type="date" error={!!errors.date} {...register("date")} />
          {errors.date && (
            <p className="mt-1 text-xs text-destructive">{errors.date.message}</p>
          )}
        </div>

        <div>
          <FieldLabel>Notes</FieldLabel>
          <GlassInput placeholder="Optional notes..." {...register("notes")} />
        </div>

        <GlassButton type="submit" variant="primary" className="w-full" disabled={isLoading}>
          {isLoading ? "Saving…" : "Log Weight"}
        </GlassButton>
      </form>
    </GlassCard>
  );
}
