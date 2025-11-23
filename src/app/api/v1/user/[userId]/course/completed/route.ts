import { NextRequest } from "next/server";

import { getUserCourseCompleted } from "@/services/firestore.service";
import { UserCourseCompleted } from "@/types/api";
import { handleApiError, requireAuth, successResponse } from "@/utils/api.utils";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        await requireAuth();

        const { userId } = await params;

        if (!userId) {
            throw new Error("VALIDATION: userId is required");
        }

        const userCourseCompleted = await getUserCourseCompleted(userId);

        const response: UserCourseCompleted[] = userCourseCompleted;

        return successResponse(response);
    } catch (error) {
        return handleApiError(error);
    }
}
