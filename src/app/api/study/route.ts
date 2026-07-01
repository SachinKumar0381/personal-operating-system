import { NextRequest } from "next/server";
import { auth } from "@/core/auth";
import { studyService } from "@/features/study-tracker/services/study-service";
import { createStudySchema } from "@/features/study-tracker/schemas/study-schema";
import { successResponse, errorResponse } from "@/shared/utils/api";
import { UnauthorizedError } from "@/core/errors";

export async function GET(): Promise<Response> {
  try {
    const session = await auth();
    if (!session?.user?.id) return errorResponse(new UnauthorizedError(), 401);

    const [entries, stats, dailyPoints] = await Promise.all([
      studyService.getStudyEntries(session.user.id),
      studyService.getStudyStats(session.user.id),
      studyService.getDailyStudyPoints(session.user.id),
    ]);

    return successResponse({ entries, stats, dailyPoints });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const session = await auth();
    if (!session?.user?.id) return errorResponse(new UnauthorizedError(), 401);

    const body = await req.json();
    const parsed = createStudySchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(new Error(parsed.error.issues[0]?.message ?? "Invalid input"), 400);
    }

    const entry = await studyService.createStudyEntry(session.user.id, parsed.data);
    return successResponse(entry, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
