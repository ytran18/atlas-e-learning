/**
 * POST /api/v1/hoc-nghe/progress/batch
 * Batch get user's progress for multiple courses
 */
import { NextRequest } from "next/server";

import { getUserProgresses } from "@/services/firestore.service";
import { CourseProgress } from "@/types/api";
import {
    errorResponse,
    handleApiError,
    parseJsonBody,
    requireAuth,
    successResponse,
} from "@/utils/api.utils";

interface BatchProgressRequest {
    groupIds: string[];
}

interface BatchProgressResponse {
    progress: Record<string, CourseProgress>;
}

/**
 * POST - Batch retrieve progress for multiple courses
 */
export async function POST(request: NextRequest) {
    try {
        // Authenticate user
        const { userId } = await requireAuth();

        // Parse request body
        const body = await parseJsonBody<BatchProgressRequest>(request);

        console.log("[HOC-NGHE Batch Progress] Request:", {
            userId,
            groupIdsCount: body.groupIds?.length,
            groupIds: body.groupIds,
        });

        if (!body.groupIds || !Array.isArray(body.groupIds) || body.groupIds.length === 0) {
            return errorResponse("groupIds must be a non-empty array", 400);
        }

        // Limit batch size to prevent abuse
        const MAX_BATCH_SIZE = 100;
        if (body.groupIds.length > MAX_BATCH_SIZE) {
            return errorResponse(`Maximum ${MAX_BATCH_SIZE} groupIds allowed per request`, 400);
        }

        // Get progress from Firestore in batch
        const progressMap = await getUserProgresses(userId, body.groupIds);

        console.log("[HOC-NGHE Batch Progress] Response:", {
            progressKeys: Object.keys(progressMap),
            progressCount: Object.keys(progressMap).length,
        });

        // Map to response format
        const response: BatchProgressResponse = {
            progress: progressMap,
        };

        return successResponse(response);
    } catch (error) {
        console.error("[HOC-NGHE Batch Progress] Error:", error);
        return handleApiError(error);
    }
}
