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
  createMealSchema,
  MEAL_TYPES,
  type CreateMealInput,
  type MealItemInput,
} from "@/features/meal-planner/schemas/meal-schema";

interface MealFormProps {
  onSubmit: (data: CreateMealInput) => void;
  isLoading?: boolean;
  defaultDate?: string;
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
      {children}
      {required && <span className="ml-0.5 text-destructive">*</span>}
    </label>
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

const EMPTY_ITEM: MealItemInput = { name: "" };

export function MealForm({ onSubmit, isLoading, defaultDate }: MealFormProps): React.ReactElement {
  const today = defaultDate ?? format(new Date(), "yyyy-MM-dd");
  const [showItems, setShowItems] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateMealInput>({
    resolver: zodResolver(createMealSchema),
    defaultValues: {
      mealType: "breakfast",
      date: today,
      items: [EMPTY_ITEM],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  function handleFormSubmit(data: CreateMealInput): void {
    onSubmit(data);
    reset({ mealType: data.mealType, date: today, items: [EMPTY_ITEM] });
    setShowItems(true);
  }

  return (
    <GlassCard variant="elevated" padding="md">
      <p className="mb-4 text-sm font-medium">Log Meal</p>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">

        {/* Meal Type + Date */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel required>Meal Type</FieldLabel>
            <SelectField {...register("mealType")}>
              {MEAL_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </SelectField>
          </div>
          <div>
            <FieldLabel required>Date</FieldLabel>
            <GlassInput type="date" error={!!errors.date} {...register("date")} />
            {errors.date && (
              <p className="mt-1 text-xs text-destructive">{errors.date.message}</p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div>
          <FieldLabel>Notes</FieldLabel>
          <GlassInput placeholder="Optional notes…" {...register("notes")} />
        </div>

        {/* Food Items */}
        <div>
          <button
            type="button"
            onClick={() => setShowItems((v) => !v)}
            className="flex w-full items-center justify-between rounded-xl border border-white/20 px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-white/10 dark:border-white/10 dark:hover:bg-white/5"
          >
            <span>
              Food Items
              <span className="ml-1 text-xs opacity-60">({fields.length} added)</span>
            </span>
            {showItems ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {errors.items && !Array.isArray(errors.items) && (
            <p className="mt-1 text-xs text-destructive">{errors.items.message}</p>
          )}

          {showItems && (
            <div className="mt-3 space-y-3">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="space-y-2 rounded-xl border border-white/15 bg-white/5 p-3 dark:border-white/8 dark:bg-white/3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-muted-foreground">Item {index + 1}</p>
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-muted-foreground transition-colors hover:text-destructive"
                        aria-label="Remove item"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>

                  <GlassInput
                    placeholder="Food name *"
                    error={!!errors.items?.[index]?.name}
                    {...register(`items.${index}.name`)}
                  />
                  {errors.items?.[index]?.name && (
                    <p className="text-xs text-destructive">
                      {errors.items[index].name?.message}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <GlassInput
                      type="number"
                      placeholder="Cal"
                      {...register(`items.${index}.calories`, { valueAsNumber: true })}
                    />
                    <GlassInput
                      type="number"
                      step="0.1"
                      placeholder="Protein (g)"
                      {...register(`items.${index}.protein`, { valueAsNumber: true })}
                    />
                    <GlassInput
                      type="number"
                      step="0.1"
                      placeholder="Carbs (g)"
                      {...register(`items.${index}.carbs`, { valueAsNumber: true })}
                    />
                    <GlassInput
                      type="number"
                      step="0.1"
                      placeholder="Fat (g)"
                      {...register(`items.${index}.fat`, { valueAsNumber: true })}
                    />
                  </div>
                </div>
              ))}

              <GlassButton
                type="button"
                variant="outline"
                size="sm"
                className="w-full gap-1.5"
                onClick={() => append(EMPTY_ITEM)}
              >
                <Plus size={14} />
                Add Item
              </GlassButton>
            </div>
          )}
        </div>

        <GlassButton type="submit" variant="primary" className="w-full" disabled={isLoading}>
          {isLoading ? "Saving…" : "Log Meal"}
        </GlassButton>
      </form>
    </GlassCard>
  );
}
