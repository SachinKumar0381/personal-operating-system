import { NextRequest } from "next/server";
import { registerSchema } from "@/features/auth/schemas/auth-schema";
import { authService } from "@/features/auth/services/auth-service";
import { successResponse, errorResponse } from "@/shared/utils/api";

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(new Error("Invalid input"), 400);
    }
    const user = await authService.register(parsed.data);
    return successResponse(user, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
