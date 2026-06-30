import type { Metadata } from "next";
import { GlassCard } from "@/shared/ui/glass-card";

export const metadata: Metadata = { title: "Sleep Tracker" };

export default function SleepPage(): React.ReactElement {
  return (
    <GlassCard variant="elevated" padding="lg">
      <h1 className="text-2xl font-semibold">Sleep Tracker</h1>
      <p className="mt-1 text-sm text-muted-foreground">Track your sleep quality and duration — coming in Phase 8c.</p>
    </GlassCard>
  );
}
