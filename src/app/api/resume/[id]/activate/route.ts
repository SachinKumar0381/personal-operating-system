import { NextRequest } from "next/server";
import { auth } from "@/core/auth";
import { resumeService } from "@/features/resume-versions/services/resume-service";
import { successResponse, errorResponse } from "@/shared/utils/api";
import { UnauthorizedError } from "@/core/errors";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(_req: NextRequest, { params }: RouteParams): Promise<Response> {
  try {
    const session = await auth();
    if (!session?.user?.id) return errorResponse(new UnauthorizedError(), 401);

    const { id } = await params;
    const version = await resumeService.setActive(session.user.id, id);
    return successResponse(version);
  } catch (error) {
    return errorResponse(error);
  }
}
