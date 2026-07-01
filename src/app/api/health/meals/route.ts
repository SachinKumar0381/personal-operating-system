import { NextRequest } from "next/server";
import { auth } from "@/core/auth";
import { mealService } from "@/features/meal-planner/services/meal-service";
import { createMealSchema } from "@/features/meal-planner/schemas/meal-schema";
import { successResponse, errorResponse } from "@/shared/utils/api";
import { UnauthorizedError } from "@/core/errors";
import { format } from "date-fns";

export async function GET(req: NextRequest): Promise<Response> {
  try {
    const session = await auth();
    if (!session?.user?.id) return errorResponse(new UnauthorizedError(), 401);

    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date") ?? format(new Date(), "yyyy-MM-dd");

    const [entries, stats] = await Promise.all([
      mealService.getMealEntries(session.user.id, date),
      mealService.getMealStats(session.user.id, date),
    ]);

    return successResponse({ entries, stats });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const session = await auth();
    if (!session?.user?.id) return errorResponse(new UnauthorizedError(), 401);

    const body = await req.json();
    const parsed = createMealSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(new Error(parsed.error.issues[0]?.message ?? "Invalid input"), 400);
    }

    const entry = await mealService.createMealEntry(session.user.id, parsed.data);
    return successResponse(entry, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
