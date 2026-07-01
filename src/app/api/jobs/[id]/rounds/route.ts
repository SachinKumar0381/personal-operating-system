import { NextRequest } from "next/server";
import { auth } from "@/core/auth";
import { jobService } from "@/features/job-tracker/services/job-service";
import { createInterviewSchema } from "@/features/job-tracker/schemas/job-schema";
import { successResponse, errorResponse } from "@/shared/utils/api";
import { UnauthorizedError } from "@/core/errors";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams): Promise<Response> {
  try {
    const session = await auth();
    if (!session?.user?.id) return errorResponse(new UnauthorizedError(), 401);

    const { id } = await params;
    const body = await req.json();
    const parsed = createInterviewSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(new Error(parsed.error.issues[0]?.message ?? "Invalid input"), 400);
    }

    const round = await jobService.addInterviewRound(session.user.id, id, parsed.data);
    return successResponse(round, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
