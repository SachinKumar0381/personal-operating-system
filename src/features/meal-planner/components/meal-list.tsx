"use client";

import { format } from "date-fns";
import { Trash2, UtensilsCrossed } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/shared/ui/glass-card";
import { GlassButton } from "@/shared/ui/glass-button";
import { GlassBadge } from "@/shared/ui/glass-badge";
import type { MealEntry } from "@/features/meal-planner/types";

interface MealListProps {
  entries: MealEntry[];
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

const MEAL_TYPE_LABELS: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
};

const MEAL_TYPE_COLORS: Record<string, "warning" | "success" | "primary" | "default"> = {
  breakfast: "warning",
  lunch: "success",
  dinner: "primary",
  snack: "default",
};

export function MealList({ entries, onDelete, isDeleting }: MealListProps): React.ReactElement {
  if (entries.length === 0) {
    return (
      <GlassCard variant="elevated" padding="md">
        <p className="mb-4 text-sm font-medium">Today&apos;s Meals</p>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <UtensilsCrossed size={32} className="mb-3 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No meals logged yet.</p>
          <p className="mt-1 text-xs text-muted-foreground/60">
            Log your first meal to start tracking.
          </p>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard variant="elevated" padding="md">
      <p className="mb-4 text-sm font-medium">Today&apos;s Meals</p>
      <ul className="space-y-2">
        <AnimatePresence initial={false}>
          {entries.map((entry) => {
            const itemCount = entry.items.length;
            const totalCal = entry.items.reduce((sum, item) => sum + (item.calories ?? 0), 0);

            return (
              <motion.li
                key={entry.id}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 transition-colors hover:bg-white/10 dark:border-white/5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <GlassBadge variant={MEAL_TYPE_COLORS[entry.mealType] ?? "default"}>
                          {MEAL_TYPE_LABELS[entry.mealType] ?? entry.mealType}
                        </GlassBadge>
                        {totalCal > 0 && (
                          <span className="text-xs font-medium tabular-nums text-orange-500">
                            {totalCal} kcal
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(entry.date), "d MMM yyyy")}
                        </span>
                      </div>

                      <ul className="mt-2 space-y-0.5">
                        {entry.items.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-1.5 text-xs">
                            <span className="font-medium">{item.name}</span>
                            {item.calories !== undefined && item.calories > 0 && (
                              <span className="text-muted-foreground">— {item.calories} kcal</span>
                            )}
                            {item.protein !== undefined && item.protein > 0 && (
                              <span className="text-muted-foreground/70">
                                · P:{item.protein}g
                              </span>
                            )}
                            {item.carbs !== undefined && item.carbs > 0 && (
                              <span className="text-muted-foreground/70">C:{item.carbs}g</span>
                            )}
                            {item.fat !== undefined && item.fat > 0 && (
                              <span className="text-muted-foreground/70">F:{item.fat}g</span>
                            )}
                          </li>
                        ))}
                      </ul>

                      {entry.notes && (
                        <p className="mt-1.5 truncate text-xs text-muted-foreground/70">
                          {entry.notes}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-muted-foreground/50">
                        {itemCount} {itemCount === 1 ? "item" : "items"}
                      </p>
                    </div>

                    <GlassButton
                      size="icon"
                      variant="ghost"
                      onClick={() => onDelete(entry.id)}
                      disabled={isDeleting}
                      aria-label="Delete meal entry"
                      className="ml-1 shrink-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 size={14} />
                    </GlassButton>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </GlassCard>
  );
}
