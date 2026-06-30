import type { Metadata } from "next";
import { GlassCard } from "@/shared/ui/glass-card";

export const metadata: Metadata = { title: "DSA Tracker" };

export default function DsaPage(): React.ReactElement {
  return (
    <GlassCard variant="elevated" padding="lg">
      <h1 className="text-2xl font-semibold">DSA Tracker</h1>
      <p className="mt-1 text-sm text-muted-foreground">Track your Data Structures & Algorithms progress — coming in Phase 9b.</p>
    </GlassCard>
  );
}
