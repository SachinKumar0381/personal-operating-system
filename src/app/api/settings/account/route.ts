import { auth } from "@/core/auth";
import { settingsService } from "@/features/settings/services/settings-service";
import { successResponse, errorResponse } from "@/shared/utils/api";
import { UnauthorizedError } from "@/core/errors";

export async function DELETE(): Promise<Response> {
  try {
    const session = await auth();
    if (!session?.user?.id) return errorResponse(new UnauthorizedError(), 401);
    await settingsService.deleteAccount(session.user.id);
    return successResponse({ message: "Account deleted" });
  } catch (error) {
    return errorResponse(error);
  }
}
