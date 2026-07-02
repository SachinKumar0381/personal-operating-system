import { auth } from "@/core/auth";
import { reportService } from "@/features/reports/services/report-service";
import { successResponse, errorResponse } from "@/shared/utils/api";
import { UnauthorizedError } from "@/core/errors";

export async function GET(): Promise<Response> {
  try {
    const session = await auth();
    if (!session?.user?.id) return errorResponse(new UnauthorizedError(), 401);

    const reports = await reportService.getAllReports(session.user.id);
    return successResponse(reports);
  } catch (error) {
    return errorResponse(error);
  }
}
