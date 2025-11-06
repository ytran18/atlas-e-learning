/**
 * Hook: useSubmitExam
 *
 * Submit câu trả lời thi và nhận kết quả
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { submitExamAnswers } from "@/services/api.client";
import { CourseType, SubmitExamRequest, SubmitExamResponse } from "@/types/api";

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
