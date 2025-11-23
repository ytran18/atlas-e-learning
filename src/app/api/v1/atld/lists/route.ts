/**
 * GET /api/v1/atld/lists
 *
 * Get list of all active ATLD courses
 * Returns: Array of course summaries with basic info
 */
import { getCourseList } from "@/services/course.service";
import { handleApiError, successResponse } from "@/utils/api.utils";

export async function GET() {
    try {
        const courseList = await getCourseList("atld");
        return successResponse(courseList);
    } catch (error) {
        console.log({ error });

        return handleApiError(error);
    }
}
