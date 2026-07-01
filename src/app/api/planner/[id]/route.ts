import { NextRequest } from "next/server";
import { auth } from "@/core/auth";
import { taskService } from "@/features/planner/services/task-service";
import { updateTaskSchema } from "@/features/planner/schemas/task-schema";
import { successResponse, errorResponse } from "@/shared/utils/api";
import { UnauthorizedError } from "@/core/errors";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const session = await auth();
    if (!session?.user?.id) return errorResponse(new UnauthorizedError(), 401);

    const { id } = await params;
    const body = await req.json();
    const parsed = updateTaskSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(new Error(parsed.error.issues[0]?.message ?? "Invalid input"), 400);
    }

    const task = await taskService.updateTask(session.user.id, id, parsed.data);
    return successResponse(task);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const session = await auth();
    if (!session?.user?.id) return errorResponse(new UnauthorizedError(), 401);

    const { id } = await params;
    await taskService.deleteTask(session.user.id, id);
    return successResponse({ deleted: true });
  } catch (error) {
    return errorResponse(error);
  }
}
