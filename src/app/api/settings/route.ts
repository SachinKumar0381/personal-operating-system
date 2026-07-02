import { auth } from "@/core/auth";
import { settingsService } from "@/features/settings/services/settings-service";
import { updateSettingsSchema } from "@/features/settings/schemas/settings-schema";
import { successResponse, errorResponse } from "@/shared/utils/api";
import { UnauthorizedError, ValidationError } from "@/core/errors";

export async function GET(): Promise<Response> {
  try {
    const session = await auth();
    if (!session?.user?.id) return errorResponse(new UnauthorizedError(), 401);
    const settings = await settingsService.getSettings(session.user.id);
    return successResponse(settings);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(req: Request): Promise<Response> {
  try {
    const session = await auth();
    if (!session?.user?.id) return errorResponse(new UnauthorizedError(), 401);
    const body = await req.json();
    const parsed = updateSettingsSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(new ValidationError(parsed.error.message), 400);
    }
    const settings = await settingsService.updateSettings(session.user.id, parsed.data);
    return successResponse(settings);
  } catch (error) {
    return errorResponse(error);
  }
}
