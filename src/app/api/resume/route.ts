import { NextRequest } from "next/server";
import { auth } from "@/core/auth";
import { resumeService } from "@/features/resume-versions/services/resume-service";
import { createResumeSchema } from "@/features/resume-versions/schemas/resume-schema";
import { successResponse, errorResponse } from "@/shared/utils/api";
import { UnauthorizedError } from "@/core/errors";

export async function GET(): Promise<Response> {
  try {
    const session = await auth();
    if (!session?.user?.id) return errorResponse(new UnauthorizedError(), 401);

    const [versions, stats] = await Promise.all([
      resumeService.getVersions(session.user.id),
      resumeService.getStats(session.user.id),
    ]);

    return successResponse({ versions, stats });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const session = await auth();
    if (!session?.user?.id) return errorResponse(new UnauthorizedError(), 401);

    const body = await req.json();
    const parsed = createResumeSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(new Error(parsed.error.issues[0]?.message ?? "Invalid input"), 400);
    }

    const version = await resumeService.createVersion(session.user.id, parsed.data);
    return successResponse(version, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
