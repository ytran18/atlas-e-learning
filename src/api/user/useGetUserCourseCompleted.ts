import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { getUserCourseCompleted } from "@/services";
import { UserCourseCompleted } from "@/types/api";

export const userCourseCompletedKeys = {
    all: ["user-course-completed"] as const,
    detail: (userId: string) => [...userCourseCompletedKeys.all, userId] as const,
};

export function useGetUserCourseCompleted(
    userId: string,
    options?: Omit<UseQueryOptions<UserCourseCompleted[], Error>, "queryKey" | "queryFn">
) {
    return useQuery({
        queryKey: userCourseCompletedKeys.detail(userId),
        queryFn: () => getUserCourseCompleted(userId),
        enabled: !!userId,
        ...options,
    });
}
