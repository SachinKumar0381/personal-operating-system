"use client";

import { useState, KeyboardEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { X, Plus } from "lucide-react";
import { GlassCard } from "@/shared/ui/glass-card";
import { GlassButton } from "@/shared/ui/glass-button";
import { GlassInput } from "@/shared/ui/glass-input";
import { cn } from "@/shared/utils/cn";
import { z } from "zod";
import {
  createHairSchema,
  HAIR_TYPES,
  type CreateHairInput,
  type HairType,
} from "@/features/hair-tracker/schemas/hair-schema";

type HairFormValues = z.input<typeof createHairSchema>;

interface HairFormProps {
  onSubmit: (data: CreateHairInput) => void;
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

const typeLabels: Record<HairType, string> = {
  oil: "Oil Treatment",
  wash: "Hair Wash",
  treatment: "Deep Treatment",
  supplement: "Supplement",
  other: "Other",
};

const typeColors: Record<HairType, string> = {
  oil: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
  wash: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20",
  treatment: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/20",
  supplement: "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/20",
  other: "bg-gray-500/15 text-gray-600 dark:text-gray-400 border-gray-500/20",
};

export function HairForm({ onSubmit, isLoading }: HairFormProps): React.ReactElement {
  const todayDate = format(new Date(), "yyyy-MM-dd");
  const [selectedType, setSelectedType] = useState<HairType>("oil");
  const [products, setProducts] = useState<string[]>([]);
  const [productInput, setProductInput] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<HairFormValues>({
    resolver: zodResolver(createHairSchema),
    defaultValues: {
      type: "oil",
      products: [],
      date: todayDate,
    },
  });

  function handleTypeSelect(type: HairType) {
    setSelectedType(type);
    setValue("type", type);
  }

  function addProduct() {
    const trimmed = productInput.trim();
    if (!trimmed || products.includes(trimmed)) return;
    const updated = [...products, trimmed];
    setProducts(updated);
    setValue("products", updated);
    setProductInput("");
  }

  function removeProduct(product: string) {
    const updated = products.filter((p) => p !== product);
    setProducts(updated);
    setValue("products", updated);
  }

  function handleProductKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addProduct();
    }
  }

  function handleFormSubmit(data: HairFormValues) {
    onSubmit(data as CreateHairInput);
    setSelectedType("oil");
    setProducts([]);
    setProductInput("");
    reset({ type: "oil", products: [], date: todayDate });
  }

  return (
    <GlassCard variant="elevated" padding="md">
      <p className="mb-4 text-sm font-medium">Log Hair Care Activity</p>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <FieldLabel required>Activity Type</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {HAIR_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleTypeSelect(type)}
                className={cn(
                  "rounded-xl border px-3 py-1.5 text-xs font-medium backdrop-blur-sm transition-all duration-200",
                  selectedType === type
                    ? typeColors[type]
                    : "border-white/20 bg-white/10 text-muted-foreground hover:bg-white/20 dark:border-white/10 dark:bg-white/5"
                )}
              >
                {typeLabels[type]}
              </button>
            ))}
          </div>
          {errors.type && (
            <p className="mt-1 text-xs text-destructive">{errors.type.message}</p>
          )}
        </div>

        <div>
          <FieldLabel>Products Used</FieldLabel>
          <div className="flex gap-2">
            <GlassInput
              placeholder="e.g. Castor oil, Minoxidil…"
              value={productInput}
              onChange={(e) => setProductInput(e.target.value)}
              onKeyDown={handleProductKeyDown}
            />
            <GlassButton
              type="button"
              variant="outline"
              size="icon"
              onClick={addProduct}
              aria-label="Add product"
            >
              <Plus size={14} />
            </GlassButton>
          </div>
          {products.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {products.map((product) => (
                <span
                  key={product}
                  className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-xs backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
                >
                  {product}
                  <button
                    type="button"
                    onClick={() => removeProduct(product)}
                    aria-label={`Remove ${product}`}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <FieldLabel required>Date</FieldLabel>
          <GlassInput type="date" error={!!errors.date} {...register("date")} />
          {errors.date && (
            <p className="mt-1 text-xs text-destructive">{errors.date.message}</p>
          )}
        </div>

        <div>
          <FieldLabel>Photo URL</FieldLabel>
          <GlassInput
            placeholder="https://... (upload in a future phase)"
            error={!!errors.photoUrl}
            {...register("photoUrl")}
          />
          {errors.photoUrl && (
            <p className="mt-1 text-xs text-destructive">{errors.photoUrl.message}</p>
          )}
        </div>

        <div>
          <FieldLabel>Notes</FieldLabel>
          <GlassInput placeholder="How did your hair feel? Any observations?" {...register("notes")} />
        </div>

        <GlassButton type="submit" variant="primary" className="w-full" disabled={isLoading}>
          {isLoading ? "Saving…" : "Log Hair Activity"}
        </GlassButton>
      </form>
    </GlassCard>
  );
}
