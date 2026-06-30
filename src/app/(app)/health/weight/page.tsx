import type { Metadata } from "next";
import { GlassCard } from "@/shared/ui/glass-card";

export const metadata: Metadata = { title: "Weight Tracker" };

export default function WeightPage(): React.ReactElement {
  return (
    <GlassCard variant="elevated" padding="lg">
      <h1 className="text-2xl font-semibold">Weight Tracker</h1>
      <p className="mt-1 text-sm text-muted-foreground">Log and chart your weight journey — coming in Phase 8a.</p>
    </GlassCard>
  );
}
