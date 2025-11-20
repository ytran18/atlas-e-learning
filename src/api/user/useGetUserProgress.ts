import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { getUserCourseProgress } from "@/services";
import { CourseType, UserCourseProgress } from "@/types/api";

export const userProgressKeys = {
    all: ["userProgress"] as const,
    detail: (userId: string, type: CourseType) => [...userProgressKeys.all, userId, type] as const,
};

export function useGetUserProgress(
    userId: string,
    type: CourseType,
    options?: Omit<UseQueryOptions<UserCourseProgress, Error>, "queryKey" | "queryFn">
) {
    return useQuery({
        queryKey: userProgressKeys.detail(userId, type),
        queryFn: () => getUserCourseProgress(userId, type),
        enabled: !!userId && !!type,
        ...options,
    });
}
