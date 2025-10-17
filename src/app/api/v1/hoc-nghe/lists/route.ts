/**
 * GET /api/v1/hoc-nghe/lists
 *
 * Get list of all active Học Nghề courses
 * Returns: Array of course summaries with basic info
 */
import { getCourseList } from "@/services/course.service";
import { handleApiError, successResponse } from "@/utils/api.utils";

export async function GET() {
    try {
        const courseList = await getCourseList("hoc-nghe");
        return successResponse(courseList);
    } catch (error) {
        return handleApiError(error);
    }
}
