/**
 * Server-side API Service
 *
 * Server-side utilities for making API calls.
 * Uses direct function calls to shared services for better performance and reliability.
 */
import { getCoursePreview } from "@/services/course.service";
import { GetCoursePreviewResponse } from "@/types/api";

export async function getCoursePreviewServer(groupId: string): Promise<GetCoursePreviewResponse> {
    try {
        return await getCoursePreview(groupId);
    } catch (error) {
        throw new Error(
            `Failed to fetch course preview: ${error instanceof Error ? error.message : "Unknown error"}`
        );
    }
}
