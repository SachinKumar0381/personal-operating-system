import { NextRequest } from "next/server";
import { auth } from "@/core/auth";
import { dsaService } from "@/features/dsa-tracker/services/dsa-service";
import { createDsaSchema } from "@/features/dsa-tracker/schemas/dsa-schema";
import { successResponse, errorResponse } from "@/shared/utils/api";
import { UnauthorizedError } from "@/core/errors";

export async function GET(): Promise<Response> {
  try {
    const session = await auth();
    if (!session?.user?.id) return errorResponse(new UnauthorizedError(), 401);

    const [problems, stats] = await Promise.all([
      dsaService.getProblems(session.user.id),
      dsaService.getStats(session.user.id),
    ]);

    return successResponse({ problems, stats });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const session = await auth();
    if (!session?.user?.id) return errorResponse(new UnauthorizedError(), 401);

    const body = await req.json();
    const parsed = createDsaSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(new Error(parsed.error.issues[0]?.message ?? "Invalid input"), 400);
    }

    const problem = await dsaService.createProblem(session.user.id, parsed.data);
    return successResponse(problem, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
