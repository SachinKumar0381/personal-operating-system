import type { Metadata } from "next";
import { GlassCard } from "@/shared/ui/glass-card";

export const metadata: Metadata = { title: "System Design Tracker" };

export default function SystemDesignPage(): React.ReactElement {
  return (
    <GlassCard variant="elevated" padding="lg">
      <h1 className="text-2xl font-semibold">System Design Tracker</h1>
      <p className="mt-1 text-sm text-muted-foreground">Track your system design learning progress — coming in Phase 9c.</p>
    </GlassCard>
  );
}
