/**
 * Hook: useExamQuestions
 *
 * Lấy danh sách câu hỏi thi cho user (không bao gồm đáp án)
 */
import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { getExamQuestions } from "@/services/api.client";
import { CourseType, GetExamResponse } from "@/types/api";

/**
 * Query key factory cho exam questions
 */
export const examQuestionsKeys = {
    all: ["examQuestions"] as const,
    lists: () => [...examQuestionsKeys.all, "list"] as const,
    list: (type: CourseType, groupId: string) =>
        [...examQuestionsKeys.lists(), type, groupId] as const,
};

export function useExamQuestions(
    type: CourseType,
    groupId: string,
    options?: Omit<UseQueryOptions<GetExamResponse, Error, GetExamResponse>, "queryKey" | "queryFn">
) {
    return useQuery({
        queryKey: examQuestionsKeys.list(type, groupId),
        queryFn: () => getExamQuestions(type, groupId),
        enabled: !!groupId, // Chỉ fetch khi có groupId
        ...options,
    });
}
