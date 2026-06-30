import type { Metadata } from "next";
import { GlassCard } from "@/shared/ui/glass-card";

export const metadata: Metadata = { title: "Hair Recovery Tracker" };

export default function HairPage(): React.ReactElement {
  return (
    <GlassCard variant="elevated" padding="lg">
      <h1 className="text-2xl font-semibold">Hair Recovery Tracker</h1>
      <p className="mt-1 text-sm text-muted-foreground">Track your hair care routine and progress — coming in Phase 8e.</p>
    </GlassCard>
  );
}
