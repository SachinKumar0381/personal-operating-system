"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/shared/ui/skeleton";
import { GlassButton } from "@/shared/ui/glass-button";
import { useMealEntries } from "@/features/meal-planner/hooks/use-meal-entries";
import { useMealMutations } from "@/features/meal-planner/hooks/use-meal-mutations";
import { MealStats } from "@/features/meal-planner/components/meal-stats";
import { MealForm } from "@/features/meal-planner/components/meal-form";
import { MealList } from "@/features/meal-planner/components/meal-list";
import type { CreateMealInput } from "@/features/meal-planner/schemas/meal-schema";

const EMPTY_STATS = {
  todayCalories: 0,
  todayProtein: 0,
  todayCarbs: 0,
  todayFat: 0,
  mealCount: 0,
};

export default function MealsPage(): React.ReactElement {
  const [selectedDate, setSelectedDate] = useState(() => format(new Date(), "yyyy-MM-dd"));

  const { data, isLoading } = useMealEntries(selectedDate);
  const { createMeal, deleteMeal } = useMealMutations(selectedDate);

  function handleCreate(input: CreateMealInput) {
    createMeal.mutate({ ...input, date: selectedDate });
  }

  function handleDelete(id: string) {
    deleteMeal.mutate(id);
  }

  function shiftDate(days: number) {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(format(d, "yyyy-MM-dd"));
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  const entries = data?.entries ?? [];
  const stats = data?.stats ?? EMPTY_STATS;

  const isToday = selectedDate === format(new Date(), "yyyy-MM-dd");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Meal Planner</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track your daily meals and macros.
          </p>
        </div>

        {/* Date navigator */}
        <div className="flex items-center gap-2">
          <GlassButton size="icon" variant="ghost" onClick={() => shiftDate(-1)} aria-label="Previous day">
            <ChevronLeft size={16} />
          </GlassButton>
          <span className="min-w-30 text-center text-sm font-medium">
            {isToday ? "Today" : format(new Date(selectedDate + "T12:00:00"), "d MMM yyyy")}
          </span>
          <GlassButton size="icon" variant="ghost" onClick={() => shiftDate(1)} aria-label="Next day">
            <ChevronRight size={16} />
          </GlassButton>
        </div>
      </div>

      <MealStats stats={stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <MealForm
          onSubmit={handleCreate}
          isLoading={createMeal.isPending}
          defaultDate={selectedDate}
        />
        <MealList
          entries={entries}
          onDelete={handleDelete}
          isDeleting={deleteMeal.isPending}
        />
      </div>
    </div>
  );
}
