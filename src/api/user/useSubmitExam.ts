/**
 * Hook: useSubmitExam
 *
 * Submit câu trả lời thi và nhận kết quả
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { submitExamAnswers } from "@/services/api.client";
import { CourseType, SubmitExamRequest, SubmitExamResponse } from "@/types/api";

/**
 * Hook submit câu trả lời thi
 *
 * @param type - Loại khóa học: "atld" hoặc "hoc-nghe"
 * @returns Mutation object với submit function
 *
 * @example
 * const submitExam = useSubmitExam("atld");
 *
 * const handleSubmit = async (answers) => {
 *   try {
 *     const result = await submitExam.mutateAsync({
 *       groupId: "group_001",
 *       answers: [
 *         { questionId: "q1", answer: "a" },
 *         { questionId: "q2", answer: "b" }
 *       ]
 *     });
 *
 *     console.log("Score:", result.score);
 *     console.log("Passed:", result.passed);
 *   } catch (error) {
 *     console.error("Submit failed:", error);
 *   }
 * };
 */
export function useSubmitExam(type: CourseType) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: SubmitExamRequest) => submitExamAnswers(type, data),
        onSuccess: (data: SubmitExamResponse, variables: SubmitExamRequest) => {
            // Invalidate related queries to refresh data
            queryClient.invalidateQueries({
                queryKey: ["courseProgress", type, variables.groupId],
            });

            // Invalidate course detail if it exists
            queryClient.invalidateQueries({
                queryKey: ["courseDetail", type, variables.groupId],
            });
        },
    });
}
