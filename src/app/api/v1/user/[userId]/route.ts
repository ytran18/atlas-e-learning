import { NextRequest } from "next/server";

import { getUserById } from "@/services/firestore.service";
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

        const userInfo = await getUserById(userId);

        if (!userInfo) {
            throw new Error("NOT_FOUND: User not found");
        }

        const response: Record<string, any> = userInfo;

        return successResponse(response);
    } catch (error) {
        return handleApiError(error);
    }
}
