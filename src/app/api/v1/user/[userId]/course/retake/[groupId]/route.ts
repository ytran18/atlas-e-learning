/**
 * POST /api/v1/user/[userId]/course/retake/[groupId]
 * Retake course - Archive old progress and reset to start
 * This is different from retake exam - it's a full course reset
 */
import { NextRequest } from "next/server";

import { retakeCourse } from "@/services/firestore.service";
import { RetakeCourseResponse } from "@/types/api";
import { handleApiError, requireAuth, successResponse } from "@/utils/api.utils";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string; groupId: string }> }
) {
    try {
        const { userId: authUserId } = await requireAuth();

        const { userId, groupId } = await params;

        // Validate params
        if (!userId || !groupId) {
            throw new Error("VALIDATION: userId and groupId are required");
        }

        // User can only retake their own course
        if (authUserId !== userId) {
            throw new Error("AUTHORIZATION: You can only retake your own courses");
        }

        // Call retakeCourse service
        const result = await retakeCourse(userId, groupId);

        if (!result.success) {
            throw new Error(result.message);
        }

        const response: RetakeCourseResponse = {
            success: true,
            attemptNumber: result.attemptNumber,
            message: result.message,
        };

        return successResponse(response);
    } catch (error) {
        return handleApiError(error);
    }
}
