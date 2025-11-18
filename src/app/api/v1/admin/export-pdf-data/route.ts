/**
 * POST /api/v1/admin/export-pdf-data
 *
 * Get student statistics data for PDF export (admin only)
 * This endpoint only fetches data, PDF generation happens on client-side
 * Query params: type, courseId
 * Body: { objectIDs: string[] } - Array of user IDs from Algolia search results
 * Returns: StudentStats[] - Array of student statistics
 */
import { NextRequest } from "next/server";

import { getGroupStatsByUserIds } from "@/services/firestore.service";
import { CourseType } from "@/types/api";
import { getQueryParams, handleApiError, requireAuth, successResponse } from "@/utils/api.utils";

export async function POST(request: NextRequest) {
    try {
        // Authenticate admin user
        await requireAuth();

        // Get query parameters
        const queryParams = getQueryParams(request);
        const type = queryParams.type as CourseType;
        const courseId = queryParams.courseId;

        // Validate required params
        if (!type || !courseId) {
            throw new Error("VALIDATION: type and courseId are required");
        }

        // Get objectIDs from request body (from Algolia results)
        const body = await request.json();
        const objectIDs: string[] = body?.objectIDs || [];

        if (objectIDs.length === 0) {
            throw new Error("VALIDATION: objectIDs are required");
        }

        // Fetch student stats directly by userIds (from Algolia results)
        const data = await getGroupStatsByUserIds(courseId, objectIDs);

        if (data.length === 0) {
            throw new Error("VALIDATION: No data to export");
        }

        return successResponse(data);
    } catch (error) {
        return handleApiError(error);
    }
}
