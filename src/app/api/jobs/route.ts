import { NextRequest } from "next/server";
import { auth } from "@/core/auth";
import { jobService } from "@/features/job-tracker/services/job-service";
import { createJobSchema } from "@/features/job-tracker/schemas/job-schema";
import { successResponse, errorResponse } from "@/shared/utils/api";
import { UnauthorizedError } from "@/core/errors";

export async function GET(): Promise<Response> {
  try {
    const session = await auth();
    if (!session?.user?.id) return errorResponse(new UnauthorizedError(), 401);

    const [applications, stats] = await Promise.all([
      jobService.getApplications(session.user.id),
      jobService.getStats(session.user.id),
    ]);

    return successResponse({ applications, stats });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const session = await auth();
    if (!session?.user?.id) return errorResponse(new UnauthorizedError(), 401);

    const body = await req.json();
    const parsed = createJobSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(new Error(parsed.error.issues[0]?.message ?? "Invalid input"), 400);
    }

    const application = await jobService.createApplication(session.user.id, parsed.data);
    return successResponse(application, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
