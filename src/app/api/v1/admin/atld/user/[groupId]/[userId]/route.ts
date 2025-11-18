/**
 * GET /api/v1/admin/atld/user/[groupId]/[userId]
 *
 * Get user progress detail from progress/{groupId}/users/{userId} (admin only)
 * Returns: Full user document with all progress fields
 */
import { NextRequest } from "next/server";

import { getUserProgressDetail } from "@/services/firestore.service";
import { StudentStats } from "@/types/api";
import { handleApiError, requireAuth, successResponse } from "@/utils/api.utils";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ groupId: string; userId: string }> }
) {
    try {
        // Authenticate admin user
        await requireAuth();

        const { groupId, userId } = await params;

        // Validate required params
        if (!groupId || !userId) {
            throw new Error("VALIDATION: groupId and userId are required");
        }

        // Get user progress detail from Firestore
        const userDetail = await getUserProgressDetail(groupId, userId);

        if (!userDetail) {
            throw new Error("NOT_FOUND: User progress not found");
        }

        const response: StudentStats = userDetail;

        return successResponse(response);
    } catch (error) {
        return handleApiError(error);
    }
}
