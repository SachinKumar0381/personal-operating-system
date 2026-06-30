import type { Metadata } from "next";
import { GlassCard } from "@/shared/ui/glass-card";

export const metadata: Metadata = { title: "Planner" };

export default function PlannerPage(): React.ReactElement {
  return (
    <GlassCard variant="elevated" padding="lg">
      <h1 className="text-2xl font-semibold">Daily Planner</h1>
      <p className="mt-1 text-sm text-muted-foreground">Plan and track your daily tasks — coming in Phase 7.</p>
    </GlassCard>
  );
}
