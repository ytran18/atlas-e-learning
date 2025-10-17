/**
 * Server-side API Service
 *
 * Server-side utilities for making API calls.
 * Uses direct function calls to shared services for better performance and reliability.
 */
import { getCourseList, getCoursePreview } from "@/services/course.service";
import { CourseType, GetCourseListResponse, GetCoursePreviewResponse } from "@/types/api";

// ============================================================================
// Server-side API Methods
// ============================================================================

/**
 * Get list of all courses (server-side)
 * Uses direct function calls to shared services instead of HTTP requests
 */
export async function getCourseListServer(type: CourseType): Promise<GetCourseListResponse> {
    try {
        return await getCourseList(type);
    } catch (error) {
        throw new Error(
            `Failed to fetch course list: ${error instanceof Error ? error.message : "Unknown error"}`
        );
    }
}

/**
 * Get course preview details (server-side)
 * Uses direct function calls to shared services instead of HTTP requests
 */
export async function getCoursePreviewServer(groupId: string): Promise<GetCoursePreviewResponse> {
    try {
        return await getCoursePreview(groupId);
    } catch (error) {
        throw new Error(
            `Failed to fetch course preview: ${error instanceof Error ? error.message : "Unknown error"}`
        );
    }
}
