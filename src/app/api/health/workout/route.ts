import { NextRequest } from "next/server";
import { auth } from "@/core/auth";
import { workoutService } from "@/features/workout-tracker/services/workout-service";
import { createWorkoutSchema } from "@/features/workout-tracker/schemas/workout-schema";
import { successResponse, errorResponse } from "@/shared/utils/api";
import { UnauthorizedError } from "@/core/errors";

export async function GET(): Promise<Response> {
  try {
    const session = await auth();
    if (!session?.user?.id) return errorResponse(new UnauthorizedError(), 401);

    const [entries, stats] = await Promise.all([
      workoutService.getWorkoutEntries(session.user.id),
      workoutService.getWorkoutStats(session.user.id),
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
    const parsed = createWorkoutSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(
        { message: "Invalid input", details: parsed.error.flatten() },
        400
      );
    }

    const entry = await workoutService.createWorkoutEntry(session.user.id, parsed.data);
    return successResponse(entry, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
