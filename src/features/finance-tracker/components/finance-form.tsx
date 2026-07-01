"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { GlassCard } from "@/shared/ui/glass-card";
import { GlassButton } from "@/shared/ui/glass-button";
import { GlassInput } from "@/shared/ui/glass-input";
import { cn } from "@/shared/utils/cn";
import {
  createFinanceSchema,
  FINANCE_TYPES,
  CATEGORIES_BY_TYPE,
  type CreateFinanceInput,
} from "@/features/finance-tracker/schemas/finance-schema";

interface FinanceFormProps {
  onSubmit: (data: CreateFinanceInput) => void;
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

export function FinanceForm({ onSubmit, isLoading }: FinanceFormProps): React.ReactElement {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateFinanceInput>({
    resolver: zodResolver(createFinanceSchema),
    defaultValues: {
      type: "expense",
      currency: "INR",
      date: format(new Date(), "yyyy-MM-dd"),
    },
  });

  const selectedType = watch("type");
  const categories = CATEGORIES_BY_TYPE[selectedType] ?? CATEGORIES_BY_TYPE.expense;

  function handleFormSubmit(data: CreateFinanceInput): void {
    onSubmit(data);
    reset({
      type: data.type,
      currency: "INR",
      date: format(new Date(), "yyyy-MM-dd"),
    });
  }

  return (
    <GlassCard variant="elevated" padding="md">
      <p className="mb-4 text-sm font-medium">Add Transaction</p>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <FieldLabel>Type *</FieldLabel>
          <SelectField {...register("type")}>
            {FINANCE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </SelectField>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Category *</FieldLabel>
            <SelectField {...register("category")} defaultValue="">
              <option value="" disabled>
                Select category
              </option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </SelectField>
            {errors.category && (
              <p className="mt-1 text-xs text-destructive">{errors.category.message}</p>
            )}
          </div>

          <div>
            <FieldLabel>Currency</FieldLabel>
            <SelectField {...register("currency")}>
              <option value="INR">INR ₹</option>
              <option value="USD">USD $</option>
              <option value="EUR">EUR €</option>
            </SelectField>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Amount *</FieldLabel>
            <GlassInput
              type="number"
              step="0.01"
              placeholder="e.g. 5000"
              error={!!errors.amount}
              {...register("amount", { valueAsNumber: true })}
            />
            {errors.amount && (
              <p className="mt-1 text-xs text-destructive">{errors.amount.message}</p>
            )}
          </div>

          <div>
            <FieldLabel>Date *</FieldLabel>
            <GlassInput type="date" error={!!errors.date} {...register("date")} />
            {errors.date && (
              <p className="mt-1 text-xs text-destructive">{errors.date.message}</p>
            )}
          </div>
        </div>

        <div>
          <FieldLabel>Description</FieldLabel>
          <GlassInput placeholder="Optional note..." {...register("description")} />
        </div>

        <GlassButton type="submit" variant="primary" className="w-full" disabled={isLoading}>
          {isLoading ? "Saving…" : "Add Transaction"}
        </GlassButton>
      </form>
    </GlassCard>
  );
}
