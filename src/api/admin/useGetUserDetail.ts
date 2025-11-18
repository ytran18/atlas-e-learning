/**
 * Hook: useGetUserDetail (Admin)
 *
 * Lấy chi tiết user progress từ progress/{groupId}/users/{userId}
 * Chỉ dành cho admin
 */
import { UseQueryOptions, useQuery } from "@tanstack/react-query";

import { getUserDetail } from "@/services/api.client";
import { CourseType, StudentStats } from "@/types/api";

/**
 * Query key factory cho user detail
 */
export const userDetailKeys = {
    all: ["userDetail"] as const,
    details: () => [...userDetailKeys.all, "details"] as const,
    detail: (type: CourseType, groupId: string, userId: string) =>
        [...userDetailKeys.details(), type, groupId, userId] as const,
};

export function useGetUserDetail(
    type: CourseType,
    groupId: string,
    userId: string,
    options?: Omit<
        UseQueryOptions<StudentStats, Error>,
        "queryKey" | "queryFn" // omit these because we set them below
    >
) {
    return useQuery({
        queryKey: userDetailKeys.detail(type, groupId, userId),
        queryFn: () => getUserDetail(type, groupId, userId),
        enabled: !!groupId && !!userId,
        ...options,
    });
}
