/**
 * GET /api/v1/admin/hoc-nghe/stats
 *
 * Get student statistics for a specific Học Nghề course (admin only)
 * Query params: groupId, pageSize (optional), cursor (optional)
 * Returns: Paginated list of students with their progress
 */
import { NextRequest } from "next/server";

import { getGroupStats } from "@/services/firestore.service";
import { GetStatsResponse } from "@/types/api";
import { getQueryParams, handleApiError, requireAuth, successResponse } from "@/utils/api.utils";

export async function GET(request: NextRequest) {
    try {
        // Authenticate admin user
        // TODO: Add admin role check here
        await requireAuth();

        // Get query parameters
        const queryParams = getQueryParams(request);

        const groupId = queryParams.groupId;

        const page = parseInt(queryParams.page || "1", 10);

        const pageSize = parseInt(queryParams.pageSize || "20", 10);

        const cursor = queryParams.cursor;

        // Validate required params
        if (!groupId) {
            throw new Error("VALIDATION: groupId is required");
        }

        // Get stats from Firestore
        const stats = await getGroupStats(groupId, page, pageSize, cursor);

        // Map to response format
        const response: GetStatsResponse = {
            data: stats.data,
            nextCursor: stats.nextCursor,
            hasMore: stats.hasMore,
            totalDocs: stats.totalDocs,
            totalPages: stats.totalPages,
        };

        return successResponse(response);
    } catch (error) {
        return handleApiError(error);
    }
}
