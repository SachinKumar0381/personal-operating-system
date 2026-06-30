import type { Metadata } from "next";
import { GlassCard } from "@/shared/ui/glass-card";

export const metadata: Metadata = { title: "Job Switch Tracker" };

export default function JobsPage(): React.ReactElement {
  return (
    <GlassCard variant="elevated" padding="lg">
      <h1 className="text-2xl font-semibold">Job Switch Tracker</h1>
      <p className="mt-1 text-sm text-muted-foreground">Track your job applications and interview pipeline — coming in Phase 10a.</p>
    </GlassCard>
  );
}
