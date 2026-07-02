"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Briefcase, FileText, TrendingUp, XCircle } from "lucide-react";
import { GlassCard } from "@/shared/ui/glass-card";
import { ReportStatCard } from "./report-stat-card";
import { GlassBadge } from "@/shared/ui/glass-badge";
import type { CareerReport, ApplicationByStatus } from "@/features/reports/types";

interface CareerReportProps {
  data: CareerReport;
}

const STATUS_COLORS: Record<string, string> = {
  applied: "hsl(221 83% 60%)",
  screening: "hsl(262 83% 60%)",
  interview: "hsl(38 92% 50%)",
  offer: "hsl(142 76% 45%)",
  rejected: "hsl(0 84% 60%)",
  withdrawn: "hsl(215 20% 65%)",
};

function statusColor(status: string): string {
  return STATUS_COLORS[status] ?? "hsl(215 20% 65%)";
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number }>;
}

function StatusTooltip({ active, payload }: TooltipProps): React.ReactElement | null {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="rounded-xl border border-white/20 bg-white/80 px-3 py-2 text-xs shadow-lg backdrop-blur-sm dark:bg-black/60 dark:border-white/10">
      <p className="capitalize font-medium">{item?.name}</p>
      <p>{item?.value} applications</p>
    </div>
  );
}

function getPieData(byStatus: ApplicationByStatus[]) {
  return byStatus.map((s) => ({
    name: s.status,
    value: s.count,
    color: statusColor(s.status),
  }));
}

export function CareerReportSection({ data }: CareerReportProps): React.ReactElement {
  const hasApplications = data.totalApplications > 0;
  const pieData = getPieData(data.byStatus);

  return (
    <GlassCard variant="default" padding="lg">
      <h2 className="mb-1 text-base font-semibold">Career Report</h2>
      <p className="mb-5 text-xs text-muted-foreground">
        Job applications, interview pipeline, and resume management
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-6">
        <ReportStatCard
          label="Total Applied"
          value={`${data.totalApplications}`}
          sub="all time"
          icon={<Briefcase size={18} />}
          accent="blue"
        />
        <ReportStatCard
          label="Active"
          value={`${data.activeApplications}`}
          sub="in pipeline"
          icon={<TrendingUp size={18} />}
          accent="green"
        />
        <ReportStatCard
          label="Offers"
          value={`${data.offers}`}
          sub={
            data.interviewSuccessRate !== null
              ? `${data.interviewSuccessRate}% success rate`
              : "no decisions yet"
          }
          icon={<FileText size={18} />}
          accent="purple"
        />
        <ReportStatCard
          label="Rejected"
          value={`${data.rejected}`}
          sub={
            data.activeResume
              ? `Active: ${data.activeResume}`
              : `${data.resumeVersions} resume version${data.resumeVersions !== 1 ? "s" : ""}`
          }
          icon={<XCircle size={18} />}
          accent="red"
        />
      </div>

      {hasApplications ? (
        <div className="flex flex-col items-center">
          <p className="mb-3 self-start text-sm font-medium">Applications by Status</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} fillOpacity={0.85} />
                ))}
              </Pie>
              <Tooltip content={<StatusTooltip />} />
              <Legend
                formatter={(value: string) =>
                  value.charAt(0).toUpperCase() + value.slice(1)
                }
                wrapperStyle={{ fontSize: 11 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 mt-2">
          <GlassBadge variant="default">
            {data.resumeVersions} resume version{data.resumeVersions !== 1 ? "s" : ""}
          </GlassBadge>
          {data.activeResume && (
            <GlassBadge variant="success">Active: {data.activeResume}</GlassBadge>
          )}
          <p className="w-full mt-3 text-center text-sm text-muted-foreground">
            Add job applications to see your pipeline.
          </p>
        </div>
      )}
    </GlassCard>
  );
}
