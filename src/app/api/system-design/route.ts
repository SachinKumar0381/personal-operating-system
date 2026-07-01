import { NextRequest } from "next/server";
import { auth } from "@/core/auth";
import { sdService } from "@/features/system-design-tracker/services/sd-service";
import { createSdSchema } from "@/features/system-design-tracker/schemas/sd-schema";
import { successResponse, errorResponse } from "@/shared/utils/api";
import { UnauthorizedError } from "@/core/errors";

export async function GET(): Promise<Response> {
  try {
    const session = await auth();
    if (!session?.user?.id) return errorResponse(new UnauthorizedError(), 401);

    const [topics, stats] = await Promise.all([
      sdService.getTopics(session.user.id),
      sdService.getStats(session.user.id),
    ]);

    return successResponse({ topics, stats });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const session = await auth();
    if (!session?.user?.id) return errorResponse(new UnauthorizedError(), 401);

    const body = await req.json();
    const parsed = createSdSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(new Error(parsed.error.issues[0]?.message ?? "Invalid input"), 400);
    }

    const topic = await sdService.createTopic(session.user.id, parsed.data);
    return successResponse(topic, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
