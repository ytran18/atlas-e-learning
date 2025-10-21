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

/**
 * Hook lấy câu hỏi thi cho user
 *
 * @param type - Loại khóa học: "atld" hoặc "hoc-nghe"
 * @param groupId - ID của khóa học
 * @param options - React Query options
 * @returns Query result với data câu hỏi thi
 *
 * @example
 * const { data, isLoading } = useExamQuestions("atld", "group_001");
 *
 * // Chỉ fetch khi user vào phần thi
 * const { data } = useExamQuestions("atld", groupId, {
 *   enabled: currentSection === "exam" && !!groupId,
 * });
 *
 * // Access data
 * if (data) {
 *   console.log(data.exam.title);
 *   console.log(data.exam.questions); // Không có answer field
 * }
 */
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
