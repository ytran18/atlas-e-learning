/**
 * GET /api/v1/atld/exam/:groupId
 *
 * Get exam questions for a course (without answers)
 * Returns: Exam questions and metadata for user to take the exam
 */
import { NextRequest } from "next/server";

import { getGroupById } from "@/services/firestore.service";
import { ExamQuestion, GetExamResponse } from "@/types/api";
import { handleApiError, requireAuth, successResponse } from "@/utils/api.utils";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ hocNgheId: string }> }
) {
    try {
        // Authenticate user
        await requireAuth();

        const { hocNgheId } = await params;

        // Get group data from Firestore
        const group = await getGroupById(hocNgheId);

        if (!group) {
            throw new Error("NOT_FOUND");
        }

        if (!group.exam || !group.exam.questions || group.exam.questions.length === 0) {
            throw new Error("EXAM_NOT_AVAILABLE");
        }

        // Remove answer field from questions for user-facing API
        const questionsForUser = group.exam.questions.map((question: ExamQuestion) => ({
            id: question.id,
            content: question.content,
            options: question.options.map((option: { id: string; content: string }) => ({
                id: option.id,
                content: option.content,
            })),
        }));

        // Map to response format
        const response: GetExamResponse = {
            groupId: group.id,
            exam: {
                title: group.exam.title || "Bài kiểm tra cuối khóa",
                description: group.exam.description,
                timeLimit: group.exam.timeLimit || 900, // 15 minutes default
                questions: questionsForUser,
            },
        };

        return successResponse(response);
    } catch (error) {
        return handleApiError(error);
    }
}
