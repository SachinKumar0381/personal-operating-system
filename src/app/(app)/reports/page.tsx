import type { Metadata } from "next";
import { GlassCard } from "@/shared/ui/glass-card";

export const metadata: Metadata = { title: "Reports" };

export default function ReportsPage(): React.ReactElement {
  return (
    <GlassCard variant="elevated" padding="lg">
      <h1 className="text-2xl font-semibold">Reports & Analytics</h1>
      <p className="mt-1 text-sm text-muted-foreground">Insights across all your life areas — coming in Phase 13.</p>
    </GlassCard>
  );
}
