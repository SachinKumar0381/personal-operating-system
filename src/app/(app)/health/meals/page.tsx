import type { Metadata } from "next";
import { GlassCard } from "@/shared/ui/glass-card";

export const metadata: Metadata = { title: "Meal Planner" };

export default function MealsPage(): React.ReactElement {
  return (
    <GlassCard variant="elevated" padding="lg">
      <h1 className="text-2xl font-semibold">Meal Planner</h1>
      <p className="mt-1 text-sm text-muted-foreground">Plan and log your daily meals — coming in Phase 8d.</p>
    </GlassCard>
  );
}
