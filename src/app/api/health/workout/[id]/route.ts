import { NextRequest } from "next/server";
import { auth } from "@/core/auth";
import { workoutService } from "@/features/workout-tracker/services/workout-service";
import { successResponse, errorResponse } from "@/shared/utils/api";
import { UnauthorizedError } from "@/core/errors";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const session = await auth();
    if (!session?.user?.id) return errorResponse(new UnauthorizedError(), 401);

    const { id } = await params;
    await workoutService.deleteWorkoutEntry(session.user.id, id);
    return successResponse({ deleted: true });
  } catch (error) {
    return errorResponse(error);
  }
}
