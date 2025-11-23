/**
 * API Utilities
 *
 * Helper functions for API routes:
 * - Authentication
 * - Response formatting
 * - Error handling
 */
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";

import { ApiErrorResponse, ApiSuccessResponse } from "@/types/api";

// ============================================================================
// Authentication
// ============================================================================

/**
 * Get authenticated user ID from request
 * Returns null if user is not authenticated
 */
async function getAuthUserId(): Promise<string | null> {
    try {
        const { userId } = await auth();
        return userId;
    } catch {
        return null;
    }
}

/**
 * Require authentication for a route
 * Returns user ID or throws error response
 */
export async function requireAuth(): Promise<{ userId: string }> {
    const userId = await getAuthUserId();

    if (!userId) {
        throw new Error("UNAUTHORIZED");
    }

    return { userId };
}

// ============================================================================
// Response Helpers
// ============================================================================

/**
 * Create a success JSON response
 */
export function successResponse<T>(data: T, status: number = 200): NextResponse {
    const response: ApiSuccessResponse<T> = {
        success: true,
        data,
    };
    return NextResponse.json(response, { status });
}

/**
 * Create an error JSON response
 */
export function errorResponse(error: string, status: number = 400, details?: string): NextResponse {
    const response: ApiErrorResponse = {
        success: false,
        error,
        details,
    };
    return NextResponse.json(response, { status });
}

// ============================================================================
// Error Handling
// ============================================================================

/**
 * Handle API errors and return appropriate response
 */
export function handleApiError(error: unknown): NextResponse {
    // Handle authentication errors
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
        return errorResponse("Unauthorized", 401);
    }

    // Handle not found errors
    if (error instanceof Error && error.message === "NOT_FOUND") {
        return errorResponse("Resource not found", 404);
    }

    // Handle validation errors
    if (error instanceof Error && error.message.startsWith("VALIDATION:")) {
        return errorResponse("Validation error", 400, error.message.replace("VALIDATION:", ""));
    }

    // Handle generic errors
    console.error("API Error:", error);
    return errorResponse(
        "Internal server error",
        500,
        error instanceof Error ? error.message : "Unknown error"
    );
}

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Validate required fields in request body
 */
export function validateRequiredFields<T extends object>(
    body: T,
    requiredFields: (keyof T)[]
): void {
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
        throw new Error(`VALIDATION: Missing required fields: ${missingFields.join(", ")}`);
    }
}

/**
 * Parse and validate JSON body
 */
export async function parseJsonBody<T>(request: NextRequest): Promise<T> {
    try {
        const body = await request.json();
        return body as T;
    } catch {
        throw new Error("VALIDATION: Invalid JSON body");
    }
}

/**
 * Get query params from URL
 */
export function getQueryParams(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    return Object.fromEntries(searchParams.entries());
}
