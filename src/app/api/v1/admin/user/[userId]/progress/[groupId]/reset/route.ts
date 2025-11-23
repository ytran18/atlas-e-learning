import { NextRequest } from "next/server";

import { deleteUserProgress } from "@/services/firestore.service";
import { handleApiError, requireAuth, successResponse } from "@/utils/api.utils";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string; groupId: string }> }
) {
    try {
        // Authenticate admin user
        await requireAuth();

        const { userId, groupId } = await params;

        if (!userId || !groupId) {
            throw new Error("VALIDATION: userId and groupId are required");
        }

        const result = await deleteUserProgress(userId, groupId);

        if (!result) {
            throw new Error("NOT_FOUND: User progress not found");
        }

        return successResponse(true);
    } catch (error) {
        return handleApiError(error);
    }
}
