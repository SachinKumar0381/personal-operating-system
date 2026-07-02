"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BookOpen, Code2, Server } from "lucide-react";
import { GlassCard } from "@/shared/ui/glass-card";
import { ReportStatCard } from "./report-stat-card";
import { GlassBadge } from "@/shared/ui/glass-badge";
import type { StudyReport } from "@/features/reports/types";

interface StudyReportProps {
  data: StudyReport;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function SubjectTooltip({ active, payload, label }: TooltipProps): React.ReactElement | null {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/20 bg-white/80 px-3 py-2 text-xs shadow-lg backdrop-blur-sm dark:bg-black/60 dark:border-white/10">
      <p className="font-medium">{label}</p>
      <p className="text-blue-500">{payload[0]?.value} hrs</p>
    </div>
  );
}

export function StudyReportSection({ data }: StudyReportProps): React.ReactElement {
  const dsaPercent = data.dsaGoal > 0 ? Math.round((data.dsaSolved / data.dsaGoal) * 100) : 0;
  const sdPercent = data.sdTotal > 0 ? Math.round((data.sdCompleted / data.sdTotal) * 100) : 0;

  const hasSubjectData = data.subjectBreakdown.length > 0;

  return (
    <GlassCard variant="default" padding="lg">
      <h2 className="mb-1 text-base font-semibold">Study Report</h2>
      <p className="mb-5 text-xs text-muted-foreground">
        Study hours, DSA progress, and system design this month
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 mb-6">
        <ReportStatCard
          label="Study Hours"
          value={`${data.totalHoursThisMonth} hrs`}
          sub="this month"
          icon={<BookOpen size={18} />}
          accent="blue"
        />
        <ReportStatCard
          label="DSA Solved"
          value={`${data.dsaSolved} / ${data.dsaGoal}`}
          sub={`${dsaPercent}% toward goal`}
          icon={<Code2 size={18} />}
          accent="green"
        />
        <ReportStatCard
          label="System Design"
          value={`${data.sdCompleted} / ${data.sdTotal}`}
          sub={`${sdPercent}% topics done`}
          icon={<Server size={18} />}
          accent="purple"
        />
      </div>

      <div>
        <p className="mb-3 text-sm font-medium">Hours by Subject (This Month)</p>
        {hasSubjectData ? (
          <>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                data={data.subjectBreakdown}
                margin={{ top: 4, right: 8, bottom: 4, left: -8 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="currentColor"
                  strokeOpacity={0.08}
                />
                <XAxis
                  dataKey="subject"
                  tick={{ fontSize: 10, fill: "currentColor", opacity: 0.5 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "currentColor", opacity: 0.5 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<SubjectTooltip />} />
                <Bar
                  dataKey="hours"
                  fill="hsl(221 83% 60%)"
                  fillOpacity={0.85}
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 flex flex-wrap gap-2">
              {data.subjectBreakdown.map((s) => (
                <GlassBadge key={s.subject} variant="primary">
                  {s.subject} · {s.hours}h
                </GlassBadge>
              ))}
            </div>
          </>
        ) : (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Log study sessions this month to see a breakdown.
          </p>
        )}
      </div>
    </GlassCard>
  );
}
