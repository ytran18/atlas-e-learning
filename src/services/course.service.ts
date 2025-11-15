/**
 * Course Service
 *
 * Shared business logic for course operations that can be used
 * both in API routes and server-side components.
 */
import { getAllGroups, getGroupById } from "@/services/firestore.service";
import { CourseListItem, GetCourseListResponse, GetCoursePreviewResponse } from "@/types/api";

/**
 * Get list of all courses by type
 * This function contains the business logic that can be shared
 * between API routes and server-side components
 */
export async function getCourseList(
    type: "atld" | "hoc-nghe" | "all"
): Promise<GetCourseListResponse> {
    // Get all active groups from Firestore
    const groups = await getAllGroups(type);

    // Map to response format
    const courseList: GetCourseListResponse = groups.map((group) => {
        const item: CourseListItem = {
            id: group.id,
            sortNo: group?.sortNo ?? undefined,
            type: group.type,
            title: group.title || "",
            description: group.description || "",
            numberOfTheory: group.theory?.videos?.length || 0,
            numberOfPractice: group.practice?.videos?.length || 0,
            totalQuestionOfExam: group.exam?.questions?.length || 0,
        };
        return item;
    });

    return courseList;
}

/**
 * Get course preview details by group ID
 * This function contains the business logic that can be shared
 * between API routes and server-side components
 */
export async function getCoursePreview(groupId: string): Promise<GetCoursePreviewResponse> {
    // Get group from Firestore
    const group = await getGroupById(groupId);

    if (!group) {
        throw new Error("Course not found");
    }

    // Map to response format
    const coursePreview: GetCoursePreviewResponse = {
        id: group.id,
        title: group.title || "",
        description: group.description || "",
        theory: {
            title: group.theory?.title || "Phần lý thuyết",
            description: group.theory?.description || "",
            videos: group.theory?.videos || [],
        },
        practice: {
            title: group.practice?.title || "Phần thực hành",
            description: group.practice?.description || "",
            videos: group.practice?.videos || [],
        },
        totalQuestionOfExam: group.exam?.questions?.length || 0,
    };

    return coursePreview;
}
