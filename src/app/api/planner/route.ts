import { NextRequest } from "next/server";
import { auth } from "@/core/auth";
import { taskService } from "@/features/planner/services/task-service";
import { createTaskSchema } from "@/features/planner/schemas/task-schema";
import { successResponse, errorResponse } from "@/shared/utils/api";
import { UnauthorizedError } from "@/core/errors";

export async function GET(req: NextRequest): Promise<Response> {
  try {
    const session = await auth();
    if (!session?.user?.id) return errorResponse(new UnauthorizedError(), 401);

    const date = req.nextUrl.searchParams.get("date") ?? new Date().toISOString();
    const tasks = await taskService.getTasksByDate(session.user.id, date);
    return successResponse(tasks);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const session = await auth();
    if (!session?.user?.id) return errorResponse(new UnauthorizedError(), 401);

    const body = await req.json();
    const parsed = createTaskSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(new Error(parsed.error.issues[0]?.message ?? "Invalid input"), 400);
    }

    const task = await taskService.createTask(session.user.id, parsed.data);
    return successResponse(task, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
