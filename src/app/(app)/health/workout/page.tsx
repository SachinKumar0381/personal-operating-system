import type { Metadata } from "next";
import { GlassCard } from "@/shared/ui/glass-card";

export const metadata: Metadata = { title: "Workout Tracker" };

export default function WorkoutPage(): React.ReactElement {
  return (
    <GlassCard variant="elevated" padding="lg">
      <h1 className="text-2xl font-semibold">Workout Tracker</h1>
      <p className="mt-1 text-sm text-muted-foreground">Log your exercise sessions — coming in Phase 8b.</p>
    </GlassCard>
  );
}
