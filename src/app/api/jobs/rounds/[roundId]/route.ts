import { NextRequest } from "next/server";
import { auth } from "@/core/auth";
import { jobService } from "@/features/job-tracker/services/job-service";
import { successResponse, errorResponse } from "@/shared/utils/api";
import { UnauthorizedError } from "@/core/errors";

interface RouteParams {
  params: Promise<{ roundId: string }>;
}

export async function DELETE(_req: NextRequest, { params }: RouteParams): Promise<Response> {
  try {
    const session = await auth();
    if (!session?.user?.id) return errorResponse(new UnauthorizedError(), 401);

    const { roundId } = await params;
    await jobService.deleteInterviewRound(session.user.id, roundId);
    return successResponse({ deleted: true });
  } catch (error) {
    return errorResponse(error);
  }
}
