import { useQuery } from "@tanstack/react-query";

import { getCourseProgress } from "@/services/api.client";
import { CourseProgress, CourseType } from "@/types/api";

interface UseAllCourseProgressOptions {
    courseIds: string[];
    type: CourseType;
    enabled?: boolean;
}

/**
 * Hook to fetch progress for multiple courses
 * In a real implementation, this would batch the API calls or use a single endpoint
 */
export function useAllCourseProgress({
    courseIds,
    type,
    enabled = true,
}: UseAllCourseProgressOptions) {
    return useQuery({
        queryKey: ["course-progress", type, courseIds],
        queryFn: async () => {
            // In a real implementation, this would be a single API call
            // that returns progress for all courses at once
            const progressPromises = courseIds.map((courseId) =>
                getCourseProgress(type, courseId).catch(() => null)
            );

            const results = await Promise.all(progressPromises);

            // Convert array to object for easier lookup
            const progressMap: Record<string, CourseProgress> = {};
            courseIds.forEach((courseId, index) => {
                if (results[index]) {
                    progressMap[courseId] = results[index]!;
                }
            });

            return progressMap;
        },
        enabled: enabled && courseIds.length > 0,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}
