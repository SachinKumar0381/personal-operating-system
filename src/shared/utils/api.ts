import { AppError } from "@/core/errors";
import { ApiResponse } from "@/shared/types";
import { NextResponse } from "next/server";

export function successResponse<T>(data: T, status = 200): NextResponse {
  const response: ApiResponse<T> = { success: true, data };
  return NextResponse.json(response, { status });
}

export function errorResponse(error: unknown, defaultStatus = 500): NextResponse {
  if (error instanceof AppError) {
    const response: ApiResponse = {
      success: false,
      error: error.message,
      details: error.code,
    };
    return NextResponse.json(response, { status: error.statusCode });
  }

  const response: ApiResponse = {
    success: false,
    error: "An unexpected error occurred",
  };
  return NextResponse.json(response, { status: defaultStatus });
}
