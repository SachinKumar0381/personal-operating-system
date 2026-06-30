import type { Metadata } from "next";
import { GlassCard } from "@/shared/ui/glass-card";

export const metadata: Metadata = { title: "Smoking Tracker" };

export default function SmokingPage(): React.ReactElement {
  return (
    <GlassCard variant="elevated" padding="lg">
      <h1 className="text-2xl font-semibold">Smoking Tracker</h1>
      <p className="mt-1 text-sm text-muted-foreground">Track your smoking reduction journey — coming in Phase 8f.</p>
    </GlassCard>
  );
}
