/**
 * POST /api/v1/hoc-nghe/exam/submit
 *
 * Submit exam answers and get results
 * Requires: hocNgheId, answers array in request body
 * Returns: Exam results with score and pass/fail status
 */
import { NextRequest } from "next/server";

import { getGroupById, updateUserProgress } from "@/services/firestore.service";
import { ExamQuestion, SubmitExamRequest, SubmitExamResponse } from "@/types/api";
import {
    handleApiError,
    parseJsonBody,
    requireAuth,
    successResponse,
    validateRequiredFields,
} from "@/utils/api.utils";

export async function POST(request: NextRequest) {
    try {
        // Authenticate user
        const { userId } = await requireAuth();

        // Parse and validate request body
        const body = await parseJsonBody<SubmitExamRequest>(request);

        validateRequiredFields(body, ["groupId", "answers"]);

        const { groupId, answers } = body;

        // Get group data to access correct answers
        const group = await getGroupById(groupId);

        if (!group) {
            throw new Error("NOT_FOUND");
        }

        if (!group.exam || !group.exam.questions || group.exam.questions.length === 0) {
            throw new Error("EXAM_NOT_AVAILABLE");
        }

        // Calculate score by comparing answers
        let correctAnswers = 0;
        const totalQuestions = group.exam.questions.length;

        // Create a map of correct answers for quick lookup
        const correctAnswersMap = new Map(
            group.exam.questions.map((question: ExamQuestion) => [question.id, question.answer])
        );

        // Check each submitted answer
        answers.forEach((answer) => {
            const correctAnswer = correctAnswersMap.get(answer.questionId);
            if (correctAnswer && answer.answer === correctAnswer) {
                correctAnswers++;
            }
        });

        // Calculate pass/fail (70% threshold)
        const passScore = group.exam.passScore || 70; // Default 70%
        const scorePercentage = (correctAnswers / totalQuestions) * 100;
        const passed = scorePercentage >= passScore;

        // Update user progress to mark course as completed
        const completedAt = Date.now();
        await updateUserProgress(userId, groupId, {
            isCompleted: true,
            examResult: {
                score: correctAnswers,
                totalQuestions,
                passed,
                completedAt,
            },
            lastUpdatedAt: completedAt,
        });

        // Map to response format
        const response: SubmitExamResponse = {
            score: correctAnswers,
            totalQuestions,
            passed,
            completedAt,
        };

        return successResponse(response);
    } catch (error) {
        return handleApiError(error);
    }
}
