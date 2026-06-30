import type { Metadata } from "next";
import { WelcomeSection } from "@/features/dashboard/components/welcome-section";
import { DailySummary } from "@/features/dashboard/components/daily-summary";
import { QuickAccessGrid } from "@/features/dashboard/components/quick-access-grid";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage(): React.ReactElement {
  return (
    <div className="space-y-6">
      <WelcomeSection />
      <DailySummary />
      <QuickAccessGrid />
    </div>
  );
}
