/**
 * GET /api/v1/hoc-nghe/preview/:groupId
 *
 * Get detailed preview of a Học Nghề course before starting
 * Returns: Course details with theory, practice sections and exam info
 */
import { NextRequest } from "next/server";

import { getGroupById } from "@/services/firestore.service";
import { GetCoursePreviewResponse } from "@/types/api";
import { handleApiError, successResponse } from "@/utils/api.utils";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ groupId: string }> }
) {
    try {
        const { groupId } = await params;

        // Get group from Firestore
        const group = await getGroupById(groupId);

        if (!group) {
            throw new Error("NOT_FOUND");
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

        return successResponse(coursePreview);
    } catch (error) {
        return handleApiError(error);
    }
}
