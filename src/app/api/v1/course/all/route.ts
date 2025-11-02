/**
 * GET /api/v1/course/all
 *
 * Get list of all active courses
 * Returns: Array of course summaries with basic info
 */
import { getCourseList } from "@/services/course.service";
import { handleApiError, successResponse } from "@/utils/api.utils";

export async function GET() {
    try {
        const courseList = await getCourseList("all");
        return successResponse(courseList);
    } catch (error) {
        return handleApiError(error);
    }
}
