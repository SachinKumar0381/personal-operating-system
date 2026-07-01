import { NextRequest } from "next/server";
import { auth } from "@/core/auth";
import { financeService } from "@/features/finance-tracker/services/finance-service";
import { createFinanceSchema } from "@/features/finance-tracker/schemas/finance-schema";
import { successResponse, errorResponse } from "@/shared/utils/api";
import { UnauthorizedError } from "@/core/errors";

export async function GET(): Promise<Response> {
  try {
    const session = await auth();
    if (!session?.user?.id) return errorResponse(new UnauthorizedError(), 401);

    const [entries, stats, monthlyTrend, categoryBreakdown] = await Promise.all([
      financeService.getFinanceEntries(session.user.id),
      financeService.getFinanceStats(session.user.id),
      financeService.getMonthlyTrend(session.user.id),
      financeService.getCategoryBreakdown(session.user.id),
    ]);

    return successResponse({ entries, stats, monthlyTrend, categoryBreakdown });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const session = await auth();
    if (!session?.user?.id) return errorResponse(new UnauthorizedError(), 401);

    const body = await req.json();
    const parsed = createFinanceSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(new Error(parsed.error.issues[0]?.message ?? "Invalid input"), 400);
    }

    const entry = await financeService.createFinanceEntry(session.user.id, parsed.data);
    return successResponse(entry, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
