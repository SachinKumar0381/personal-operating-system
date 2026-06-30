import type { Metadata } from "next";
import { GlassCard } from "@/shared/ui/glass-card";

export const metadata: Metadata = { title: "Study Tracker" };

export default function StudyPage(): React.ReactElement {
  return (
    <GlassCard variant="elevated" padding="lg">
      <h1 className="text-2xl font-semibold">Study Tracker</h1>
      <p className="mt-1 text-sm text-muted-foreground">Log your study sessions by subject — coming in Phase 9a.</p>
    </GlassCard>
  );
}
