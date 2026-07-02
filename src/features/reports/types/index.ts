// ── Weekly / Monthly Summary ───────────────────────────────────────────────────

export interface WeeklySummary {
  studyHours: number;
  workoutsCompleted: number;
  avgSleepHours: number | null;
  weightChange: number | null;
  tasksCompleted: number;
  taskTotal: number;
  smokingAvgPerDay: number | null;
  financeIncome: number;
  financeExpenses: number;
  financeSavings: number;
}

export interface MonthlySummary {
  studyHours: number;
  workoutsCompleted: number;
  avgSleepHours: number | null;
  weightChange: number | null;
  tasksCompleted: number;
  taskTotal: number;
  smokingAvgPerDay: number | null;
  financeIncome: number;
  financeExpenses: number;
  financeSavings: number;
}

// ── Health Report ──────────────────────────────────────────────────────────────

export interface WeightPoint {
  date: string;
  weight: number;
  unit: string;
}

export interface HealthReport {
  weightTrend: WeightPoint[];
  workoutFrequency: number;
  avgSleepHours: number | null;
  avgSleepQuality: number | null;
  totalMealCalories: number | null;
  avgDailyCalories: number | null;
}

// ── Study Report ───────────────────────────────────────────────────────────────

export interface SubjectHours {
  subject: string;
  hours: number;
  sessions: number;
}

export interface StudyReport {
  totalHoursThisMonth: number;
  subjectBreakdown: SubjectHours[];
  dsaSolved: number;
  dsaTotal: number;
  dsaGoal: number;
  sdCompleted: number;
  sdTotal: number;
}

// ── Career Report ──────────────────────────────────────────────────────────────

export interface ApplicationByStatus {
  status: string;
  count: number;
}

export interface CareerReport {
  totalApplications: number;
  activeApplications: number;
  offers: number;
  rejected: number;
  interviewSuccessRate: number | null;
  byStatus: ApplicationByStatus[];
  resumeVersions: number;
  activeResume: string | null;
}

// ── Finance Report ─────────────────────────────────────────────────────────────

export interface MonthlyFinanceTrend {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

export interface ExpenseCategory {
  category: string;
  amount: number;
  percentage: number;
}

export interface FinanceReport {
  monthlyTrend: MonthlyFinanceTrend[];
  topExpenseCategories: ExpenseCategory[];
  thisMonthIncome: number;
  thisMonthExpenses: number;
  thisMonthSavings: number;
  netSavings: number;
}

// ── Aggregate response ─────────────────────────────────────────────────────────

export interface AllReports {
  weekly: WeeklySummary;
  monthly: MonthlySummary;
  health: HealthReport;
  study: StudyReport;
  career: CareerReport;
  finance: FinanceReport;
}
