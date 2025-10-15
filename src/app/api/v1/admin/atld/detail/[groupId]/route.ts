/**
 * GET /api/v1/admin/atld/detail/:groupId
 *
 * Get complete course details including all sections and questions (admin only)
 * Returns: Full course data with theory, practice, exam details
 */
import { NextRequest } from "next/server";

import { getGroupById } from "@/services/firestore.service";
import { GetCourseDetailResponse } from "@/types/api";
import { handleApiError, requireAuth, successResponse } from "@/utils/api.utils";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ groupId: string }> }
) {
    try {
        // Authenticate admin user
        // TODO: Add admin role check here
        await requireAuth();

        const { groupId } = await params;

        // Get full group data from Firestore
        const group = await getGroupById(groupId);

        if (!group) {
            throw new Error("NOT_FOUND");
        }

        // Map to response format
        const response: GetCourseDetailResponse = {
            id: group.id,
            title: group.title || "",
            description: group.description || "",
            type: group.type || "atld",
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
            exam: {
                title: group.exam?.title || "Bài kiểm tra",
                description: group.exam?.description || "",
                timeLimit: group.exam?.timeLimit || 900,
                questions: group.exam?.questions || [],
                passScore: group.exam?.passScore,
            },
            createdAt: group.createdAt || Date.now(),
            updatedAt: group.updatedAt || Date.now(),
        };

        return successResponse(response);
    } catch (error) {
        return handleApiError(error);
    }
}
