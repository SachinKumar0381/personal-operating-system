import type { Metadata } from "next";
import { GlassCard } from "@/shared/ui/glass-card";

export const metadata: Metadata = { title: "Finance Tracker" };

export default function FinancePage(): React.ReactElement {
  return (
    <GlassCard variant="elevated" padding="lg">
      <h1 className="text-2xl font-semibold">Finance Tracker</h1>
      <p className="mt-1 text-sm text-muted-foreground">Track your income, expenses, and savings — coming in Phase 11.</p>
    </GlassCard>
  );
}
