import { NextRequest } from "next/server";

import { getUserCourseProgress } from "@/services/firestore.service";
import { CourseType, UserCourseProgress } from "@/types/api";
import { handleApiError, requireAuth, successResponse } from "@/utils/api.utils";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        await requireAuth();

        const { userId } = await params;

        const type = request.nextUrl.searchParams.get("type");

        if (!userId) {
            throw new Error("VALIDATION: userId is required");
        }

        const userCourseProgress = await getUserCourseProgress(userId, type as CourseType);

        if (!userCourseProgress) {
            throw new Error("NOT_FOUND: User course progress not found");
        }

        const response: UserCourseProgress = userCourseProgress;

        return successResponse(response);
    } catch (error) {
        return handleApiError(error);
    }
}
