/**
 * GET /api/v1/atld/progress/:groupId
 * Get user's progress for a specific course
 *
 * PATCH /api/v1/atld/progress/:groupId
 * Update user's progress for a specific course
 */
import { NextRequest } from "next/server";

import { getUserProgress, updateUserProgress } from "@/services/firestore.service";
import { GetProgressResponse, UpdateProgressRequest, UpdateProgressResponse } from "@/types/api";
import {
    errorResponse,
    handleApiError,
    parseJsonBody,
    requireAuth,
    successResponse,
} from "@/utils/api.utils";

/**
 * GET - Retrieve progress
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ groupId: string }> }
) {
    try {
        // Authenticate user
        const { userId } = await requireAuth();

        const { groupId } = await params;

        // Get progress from Firestore
        const progress = await getUserProgress(userId, groupId);

        if (!progress) {
            return errorResponse("Progress not found. Please start the course first.", 404);
        }

        // Map to response format
        const response: GetProgressResponse = {
            groupId: progress.groupId,
            currentSection: progress.currentSection,
            currentVideoIndex: progress.currentVideoIndex,
            currentTime: progress.currentTime,
            completedVideos: progress.completedVideos || [],
            isCompleted: progress.isCompleted,
            startedAt: progress.startedAt,
            lastUpdatedAt: progress.lastUpdatedAt,
            finishImageUrl: progress.finishImageUrl,
            startImageUrl: progress.startImageUrl,
            examResult: progress.examResult,
            courseName: progress.courseName,
        };

        return successResponse(response);
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * PATCH - Update progress
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ groupId: string }> }
) {
    try {
        // Authenticate user
        const { userId } = await requireAuth();
        const { groupId } = await params;

        // Parse request body
        const body = await parseJsonBody<UpdateProgressRequest>(request);

        // Update progress in Firestore
        const result = await updateUserProgress(userId, groupId, {
            section: body.section,
            videoIndex: body.videoIndex,
            currentTime: body.currentTime,
            isCompleted: body.isCompleted,
            completedVideo: body.completedVideo,
            finishImageUrl: body.finishImageUrl,
        });

        // Map to response format
        const response: UpdateProgressResponse = {
            success: result.success,
            lastUpdatedAt: result.lastUpdatedAt,
        };

        return successResponse(response);
    } catch (error) {
        return handleApiError(error);
    }
}
