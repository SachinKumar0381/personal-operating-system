import type { Metadata } from "next";
import { GlassCard } from "@/shared/ui/glass-card";

export const metadata: Metadata = { title: "Test Series Tracker" };

export default function TestSeriesPage(): React.ReactElement {
  return (
    <GlassCard variant="elevated" padding="lg">
      <h1 className="text-2xl font-semibold">Test Series Tracker</h1>
      <p className="mt-1 text-sm text-muted-foreground">Track your Test Series SaaS project progress — coming in Phase 12.</p>
    </GlassCard>
  );
}
