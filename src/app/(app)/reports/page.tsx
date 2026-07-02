"use client";

import { Skeleton } from "@/shared/ui/skeleton";
import { useReports } from "@/features/reports/hooks/use-reports";
import { WeeklySummarySection } from "@/features/reports/components/weekly-summary";
import { MonthlySummarySection } from "@/features/reports/components/monthly-summary";
import { HealthReportSection } from "@/features/reports/components/health-report";
import { StudyReportSection } from "@/features/reports/components/study-report";
import { CareerReportSection } from "@/features/reports/components/career-report";
import { FinanceReportSection } from "@/features/reports/components/finance-report";

function ReportSkeleton(): React.ReactElement {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    </div>
  );
}

export default function ReportsPage(): React.ReactElement {
  const { data, isLoading, isError } = useReports();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Reports & Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Loading your data across all life areas…
          </p>
        </div>
        <ReportSkeleton />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Reports & Analytics</h1>
          <p className="mt-1 text-sm text-destructive">
            Failed to load reports. Please refresh the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Reports & Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Aggregated insights across all your life areas.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <WeeklySummarySection data={data.weekly} />
        <MonthlySummarySection data={data.monthly} />
      </div>

      <HealthReportSection data={data.health} />

      <div className="grid gap-6 lg:grid-cols-2">
        <StudyReportSection data={data.study} />
        <CareerReportSection data={data.career} />
      </div>

      <FinanceReportSection data={data.finance} />
    </div>
  );
}
