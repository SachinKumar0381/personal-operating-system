import { NextRequest } from "next/server";
import { auth } from "@/core/auth";
import { testSeriesService } from "@/features/test-series-tracker/services/test-series-service";
import { createTestSeriesSchema } from "@/features/test-series-tracker/schemas/test-series-schema";
import { successResponse, errorResponse } from "@/shared/utils/api";
import { UnauthorizedError } from "@/core/errors";

export async function GET(): Promise<Response> {
  try {
    const session = await auth();
    if (!session?.user?.id) return errorResponse(new UnauthorizedError(), 401);

    const [entries, stats] = await Promise.all([
      testSeriesService.getEntries(session.user.id),
      testSeriesService.getStats(session.user.id),
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
    const parsed = createTestSeriesSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(new Error(parsed.error.issues[0]?.message ?? "Invalid input"), 400);
    }

    const entry = await testSeriesService.createEntry(session.user.id, parsed.data);
    return successResponse(entry, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
