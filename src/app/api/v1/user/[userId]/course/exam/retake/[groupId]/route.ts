import { NextRequest } from "next/server";

import { retakeCourseExam } from "@/services/firestore.service";
import { handleApiError, requireAuth, successResponse } from "@/utils/api.utils";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string; groupId: string }> }
) {
    try {
        await requireAuth();

        const { userId, groupId } = await params;

        if (!userId || !groupId) {
            throw new Error("VALIDATION: userId and groupId is required");
        }

        await retakeCourseExam(userId, groupId);

        return successResponse(null);
    } catch (error) {
        return handleApiError(error);
    }
}
