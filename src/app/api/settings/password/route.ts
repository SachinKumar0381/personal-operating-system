import { NextRequest } from "next/server";
import { auth } from "@/core/auth";
import { settingsService } from "@/features/settings/services/settings-service";
import { changePasswordSchema } from "@/features/settings/schemas/settings-schema";
import { successResponse, errorResponse } from "@/shared/utils/api";
import { UnauthorizedError, ValidationError } from "@/core/errors";

export async function PATCH(req: NextRequest): Promise<Response> {
  try {
    const session = await auth();
    if (!session?.user?.id) return errorResponse(new UnauthorizedError(), 401);
    const body = await req.json();
    const parsed = changePasswordSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(new ValidationError(parsed.error.message), 400);
    }
    await settingsService.changePassword(
      session.user.id,
      parsed.data.currentPassword,
      parsed.data.newPassword
    );
    return successResponse({ message: "Password changed successfully" });
  } catch (error) {
    return errorResponse(error);
  }
}
