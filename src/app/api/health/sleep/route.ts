import { NextRequest } from "next/server";
import { auth } from "@/core/auth";
import { sleepService } from "@/features/sleep-tracker/services/sleep-service";
import { createSleepSchema } from "@/features/sleep-tracker/schemas/sleep-schema";
import { successResponse, errorResponse } from "@/shared/utils/api";
import { UnauthorizedError } from "@/core/errors";

export async function GET(): Promise<Response> {
  try {
    const session = await auth();
    if (!session?.user?.id) return errorResponse(new UnauthorizedError(), 401);

    const entries = await sleepService.getSleepEntries(session.user.id);
    const stats = await sleepService.getSleepStats(session.user.id);
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
    const parsed = createSleepSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(new Error(parsed.error.issues[0]?.message ?? "Invalid input"), 400);
    }

    const entry = await sleepService.createSleepEntry(session.user.id, parsed.data);
    return successResponse(entry, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
