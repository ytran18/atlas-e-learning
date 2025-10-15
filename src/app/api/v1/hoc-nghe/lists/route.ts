/**
 * GET /api/v1/hoc-nghe/lists
 *
 * Get list of all active Học Nghề courses
 * Returns: Array of course summaries with basic info
 */
import { getAllGroups } from "@/services/firestore.service";
import { CourseListItem, GetCourseListResponse } from "@/types/api";
import { handleApiError, successResponse } from "@/utils/api.utils";

export async function GET() {
    try {
        // Get all active groups from Firestore
        const groups = await getAllGroups("hoc-nghe");

        // Filter for hoc-nghe type only
        const hocNgheGroups = groups.filter((group) => group.type === "hoc-nghe");

        // Map to response format
        const courseList: GetCourseListResponse = hocNgheGroups.map((group) => {
            const item: CourseListItem = {
                id: group.id,
                title: group.title || "",
                description: group.description || "",
                numberOfTheory: group.theory?.videos?.length || 0,
                numberOfPractice: group.practice?.videos?.length || 0,
                totalQuestionOfExam: group.exam?.questions?.length || 0,
            };
            return item;
        });

        return successResponse(courseList);
    } catch (error) {
        return handleApiError(error);
    }
}
