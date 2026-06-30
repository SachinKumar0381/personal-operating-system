import type { Metadata } from "next";
import { GlassCard } from "@/shared/ui/glass-card";

export const metadata: Metadata = { title: "Resume Versions" };

export default function ResumePage(): React.ReactElement {
  return (
    <GlassCard variant="elevated" padding="lg">
      <h1 className="text-2xl font-semibold">Resume Versions</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage your resume versions — coming in Phase 10b.</p>
    </GlassCard>
  );
}
