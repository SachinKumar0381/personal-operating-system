import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subMonths,
  format,
  subDays,
} from "date-fns";
import { prisma } from "@/core/database";
import type {
  WeeklySummary,
  MonthlySummary,
  HealthReport,
  StudyReport,
  CareerReport,
  FinanceReport,
  AllReports,
  WeightPoint,
  SubjectHours,
  ApplicationByStatus,
  MonthlyFinanceTrend,
  ExpenseCategory,
} from "@/features/reports/types";

// ── Helpers ────────────────────────────────────────────────────────────────────

function sumField<T>(items: T[], key: keyof T): number {
  return items.reduce((acc, item) => acc + (Number(item[key]) || 0), 0);
}

function avg(items: number[]): number | null {
  if (items.length === 0) return null;
  return Math.round((items.reduce((a, b) => a + b, 0) / items.length) * 10) / 10;
}

// ── Weekly Summary ─────────────────────────────────────────────────────────────

async function getWeeklySummary(userId: string): Promise<WeeklySummary> {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  const [
    studyEntries,
    workouts,
    sleepEntries,
    weightEntries,
    plannerTasks,
    smokingEntries,
    financeEntries,
  ] = await Promise.all([
    prisma.studyEntry.findMany({ where: { userId, date: { gte: weekStart, lte: weekEnd } } }),
    prisma.workoutEntry.count({ where: { userId, date: { gte: weekStart, lte: weekEnd } } }),
    prisma.sleepEntry.findMany({ where: { userId, date: { gte: weekStart, lte: weekEnd } } }),
    prisma.weightEntry.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 2,
    }),
    prisma.plannerTask.findMany({ where: { userId, date: { gte: weekStart, lte: weekEnd } } }),
    prisma.smokingEntry.findMany({ where: { userId, date: { gte: weekStart, lte: weekEnd } } }),
    prisma.financeEntry.findMany({ where: { userId, date: { gte: weekStart, lte: weekEnd } } }),
  ]);

  const studyMinutes = sumField(studyEntries, "duration");
  const avgSleep = avg(sleepEntries.map((e) => e.duration));
  const weightChange =
    weightEntries.length >= 2
      ? +(weightEntries[0].weight - weightEntries[1].weight).toFixed(1)
      : null;
  const tasksCompleted = plannerTasks.filter((t) => t.status === "done").length;
  const smokingTotal = sumField(smokingEntries, "cigarettesSmoked");
  const smokingDays = smokingEntries.length > 0 ? 7 : 0;
  const smokingAvgPerDay = smokingDays > 0 ? +(smokingTotal / smokingDays).toFixed(1) : null;

  return {
    studyHours: +(studyMinutes / 60).toFixed(1),
    workoutsCompleted: workouts,
    avgSleepHours: avgSleep,
    weightChange,
    tasksCompleted,
    taskTotal: plannerTasks.length,
    smokingAvgPerDay,
    financeIncome: financeEntries.filter((e) => e.type === "income").reduce((s, e) => s + e.amount, 0),
    financeExpenses: financeEntries.filter((e) => e.type === "expense").reduce((s, e) => s + e.amount, 0),
    financeSavings: financeEntries.filter((e) => e.type === "saving").reduce((s, e) => s + e.amount, 0),
  };
}

// ── Monthly Summary ────────────────────────────────────────────────────────────

async function getMonthlySummary(userId: string): Promise<MonthlySummary> {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const [
    studyEntries,
    workouts,
    sleepEntries,
    weightEntries,
    plannerTasks,
    smokingEntries,
    financeEntries,
  ] = await Promise.all([
    prisma.studyEntry.findMany({ where: { userId, date: { gte: monthStart, lte: monthEnd } } }),
    prisma.workoutEntry.count({ where: { userId, date: { gte: monthStart, lte: monthEnd } } }),
    prisma.sleepEntry.findMany({ where: { userId, date: { gte: monthStart, lte: monthEnd } } }),
    prisma.weightEntry.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 2,
    }),
    prisma.plannerTask.findMany({ where: { userId, date: { gte: monthStart, lte: monthEnd } } }),
    prisma.smokingEntry.findMany({ where: { userId, date: { gte: monthStart, lte: monthEnd } } }),
    prisma.financeEntry.findMany({ where: { userId, date: { gte: monthStart, lte: monthEnd } } }),
  ]);

  const studyMinutes = sumField(studyEntries, "duration");
  const avgSleep = avg(sleepEntries.map((e) => e.duration));
  const weightChange =
    weightEntries.length >= 2
      ? +(weightEntries[0].weight - weightEntries[1].weight).toFixed(1)
      : null;
  const tasksCompleted = plannerTasks.filter((t) => t.status === "done").length;
  const smokingTotal = sumField(smokingEntries, "cigarettesSmoked");
  const daysInMonth = now.getDate();
  const smokingAvgPerDay =
    smokingEntries.length > 0 ? +(smokingTotal / daysInMonth).toFixed(1) : null;

  return {
    studyHours: +(studyMinutes / 60).toFixed(1),
    workoutsCompleted: workouts,
    avgSleepHours: avgSleep,
    weightChange,
    tasksCompleted,
    taskTotal: plannerTasks.length,
    smokingAvgPerDay,
    financeIncome: financeEntries.filter((e) => e.type === "income").reduce((s, e) => s + e.amount, 0),
    financeExpenses: financeEntries.filter((e) => e.type === "expense").reduce((s, e) => s + e.amount, 0),
    financeSavings: financeEntries.filter((e) => e.type === "saving").reduce((s, e) => s + e.amount, 0),
  };
}

// ── Health Report ──────────────────────────────────────────────────────────────

async function getHealthReport(userId: string): Promise<HealthReport> {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const [weightEntries, workoutCount, sleepEntries, mealEntries] = await Promise.all([
    prisma.weightEntry.findMany({
      where: { userId },
      orderBy: { date: "asc" },
      take: 30,
    }),
    prisma.workoutEntry.count({ where: { userId, date: { gte: monthStart, lte: monthEnd } } }),
    prisma.sleepEntry.findMany({
      where: { userId, date: { gte: subDays(now, 13) } },
      orderBy: { date: "asc" },
    }),
    prisma.mealEntry.findMany({
      where: { userId, date: { gte: monthStart, lte: monthEnd } },
    }),
  ]);

  const weightTrend: WeightPoint[] = weightEntries.map((e) => ({
    date: format(e.date, "d MMM"),
    weight: e.weight,
    unit: e.unit,
  }));

  const avgSleepHours = avg(sleepEntries.map((e) => e.duration));
  const avgSleepQuality = avg(sleepEntries.map((e) => e.quality));

  // Sum calories from meal items (stored as JSON array)
  let totalCalories = 0;
  let mealDaysWithCalories = 0;
  for (const meal of mealEntries) {
    if (meal.totalCalories && meal.totalCalories > 0) {
      totalCalories += meal.totalCalories;
      mealDaysWithCalories++;
    }
  }

  return {
    weightTrend,
    workoutFrequency: workoutCount,
    avgSleepHours,
    avgSleepQuality,
    totalMealCalories: totalCalories > 0 ? totalCalories : null,
    avgDailyCalories:
      mealDaysWithCalories > 0 ? Math.round(totalCalories / mealDaysWithCalories) : null,
  };
}

// ── Study Report ───────────────────────────────────────────────────────────────

async function getStudyReport(userId: string): Promise<StudyReport> {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const [monthStudy, dsaProblems, sdTopics] = await Promise.all([
    prisma.studyEntry.findMany({
      where: { userId, date: { gte: monthStart, lte: monthEnd } },
    }),
    prisma.dsaProblem.findMany({ where: { userId } }),
    prisma.systemDesignTopic.findMany({ where: { userId } }),
  ]);

  const totalMinutes = sumField(monthStudy, "duration");

  // Subject breakdown
  const subjectMap = new Map<string, { minutes: number; sessions: number }>();
  for (const e of monthStudy) {
    const existing = subjectMap.get(e.subject) ?? { minutes: 0, sessions: 0 };
    subjectMap.set(e.subject, {
      minutes: existing.minutes + e.duration,
      sessions: existing.sessions + 1,
    });
  }
  const subjectBreakdown: SubjectHours[] = Array.from(subjectMap.entries())
    .map(([subject, { minutes, sessions }]) => ({
      subject,
      hours: +(minutes / 60).toFixed(1),
      sessions,
    }))
    .sort((a, b) => b.hours - a.hours);

  const dsaSolved = dsaProblems.filter((p) => p.status === "solved").length;
  const dsaGoal = 300;

  const sdCompleted = sdTopics.filter((t) => t.status === "completed").length;

  return {
    totalHoursThisMonth: +(totalMinutes / 60).toFixed(1),
    subjectBreakdown,
    dsaSolved,
    dsaTotal: dsaProblems.length,
    dsaGoal,
    sdCompleted,
    sdTotal: sdTopics.length,
  };
}

// ── Career Report ──────────────────────────────────────────────────────────────

async function getCareerReport(userId: string): Promise<CareerReport> {
  const [jobs, resumes] = await Promise.all([
    prisma.jobApplication.findMany({
      where: { userId },
      include: { interviewRounds: true },
    }),
    prisma.resumeVersion.findMany({ where: { userId } }),
  ]);

  const activeStatuses = ["applied", "screening", "interview"];
  const active = jobs.filter((j) => activeStatuses.includes(j.status)).length;
  const offers = jobs.filter((j) => j.status === "offer").length;
  const rejected = jobs.filter((j) => j.status === "rejected").length;

  // Interview success rate: offers / (offers + rejected)
  const decided = offers + rejected;
  const interviewSuccessRate = decided > 0 ? Math.round((offers / decided) * 100) : null;

  const statusMap = new Map<string, number>();
  for (const j of jobs) {
    statusMap.set(j.status, (statusMap.get(j.status) ?? 0) + 1);
  }
  const byStatus: ApplicationByStatus[] = Array.from(statusMap.entries()).map(
    ([status, count]) => ({ status, count })
  );

  const activeResume = resumes.find((r) => r.isActive)?.version ?? null;

  return {
    totalApplications: jobs.length,
    activeApplications: active,
    offers,
    rejected,
    interviewSuccessRate,
    byStatus,
    resumeVersions: resumes.length,
    activeResume,
  };
}

// ── Finance Report ─────────────────────────────────────────────────────────────

async function getFinanceReport(userId: string): Promise<FinanceReport> {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const sixMonthsAgo = startOfMonth(subMonths(now, 5));

  const [allEntries, thisMonthEntries] = await Promise.all([
    prisma.financeEntry.findMany({ where: { userId, date: { gte: sixMonthsAgo } } }),
    prisma.financeEntry.findMany({ where: { userId, date: { gte: monthStart, lte: monthEnd } } }),
  ]);

  // Monthly trend (last 6 months)
  const monthlyTrend: MonthlyFinanceTrend[] = Array.from({ length: 6 }, (_, i) => {
    const d = subMonths(now, 5 - i);
    const mStart = startOfMonth(d);
    const mEnd = endOfMonth(d);
    const month = allEntries.filter((e) => e.date >= mStart && e.date <= mEnd);

    return {
      month: format(d, "MMM yy"),
      income: month.filter((e) => e.type === "income").reduce((s, e) => s + e.amount, 0),
      expenses: month.filter((e) => e.type === "expense").reduce((s, e) => s + e.amount, 0),
      savings: month.filter((e) => e.type === "saving").reduce((s, e) => s + e.amount, 0),
    };
  });

  // Top expense categories (all time from last 6 months)
  const expenseMap = new Map<string, number>();
  const allExpenses = allEntries.filter((e) => e.type === "expense");
  const totalExpenseAmount = allExpenses.reduce((s, e) => s + e.amount, 0);
  for (const e of allExpenses) {
    expenseMap.set(e.category, (expenseMap.get(e.category) ?? 0) + e.amount);
  }
  const topExpenseCategories: ExpenseCategory[] = Array.from(expenseMap.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      percentage:
        totalExpenseAmount > 0 ? Math.round((amount / totalExpenseAmount) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 6);

  // This month stats
  const thisMonthIncome = thisMonthEntries
    .filter((e) => e.type === "income")
    .reduce((s, e) => s + e.amount, 0);
  const thisMonthExpenses = thisMonthEntries
    .filter((e) => e.type === "expense")
    .reduce((s, e) => s + e.amount, 0);
  const thisMonthSavings = thisMonthEntries
    .filter((e) => e.type === "saving")
    .reduce((s, e) => s + e.amount, 0);

  const allTimeIncome = allEntries
    .filter((e) => e.type === "income")
    .reduce((s, e) => s + e.amount, 0);
  const allTimeExpenses = allEntries
    .filter((e) => e.type === "expense")
    .reduce((s, e) => s + e.amount, 0);

  return {
    monthlyTrend,
    topExpenseCategories,
    thisMonthIncome,
    thisMonthExpenses,
    thisMonthSavings,
    netSavings: allTimeIncome - allTimeExpenses,
  };
}

// ── Public API ─────────────────────────────────────────────────────────────────

export const reportService = {
  async getAllReports(userId: string): Promise<AllReports> {
    const [weekly, monthly, health, study, career, finance] = await Promise.all([
      getWeeklySummary(userId),
      getMonthlySummary(userId),
      getHealthReport(userId),
      getStudyReport(userId),
      getCareerReport(userId),
      getFinanceReport(userId),
    ]);

    return { weekly, monthly, health, study, career, finance };
  },
};
