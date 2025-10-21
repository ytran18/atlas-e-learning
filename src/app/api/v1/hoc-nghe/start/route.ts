/**
 * POST /api/v1/hoc-nghe/start
 *
 * Start a Học Nghề course - creates initial progress record
 * Requires: groupId, portraitUrl in request body
 * Returns: Initial progress state
 */
import { NextRequest } from "next/server";

import { createUserProgress } from "@/services/firestore.service";
import { StartCourseRequest, StartCourseResponse } from "@/types/api";
import {
    handleApiError,
    parseJsonBody,
    requireAuth,
    successResponse,
    validateRequiredFields,
} from "@/utils/api.utils";

export async function POST(request: NextRequest) {
    try {
        // Authenticate user
        const { userId } = await requireAuth();

        // Parse and validate request body
        const body = await parseJsonBody<StartCourseRequest>(request);
        validateRequiredFields(body, ["groupId", "portraitUrl"]);

        const { groupId, portraitUrl } = body;

        // Create initial progress
        const progress = await createUserProgress(userId, groupId, portraitUrl);

        // Map to response format
        const response: StartCourseResponse = {
            groupId: progress.groupId,
            currentSection: progress.currentSection,
            currentVideoIndex: progress.currentVideoIndex,
            currentTime: progress.currentTime,
            startedAt: progress.startedAt,
            isCompleted: progress.isCompleted,
        };

        return successResponse(response, 201);
    } catch (error) {
        return handleApiError(error);
    }
}
