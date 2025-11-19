import { useQuery } from "@tanstack/react-query";

import { getAllCourseProgresses } from "@/services/api.client";
import { CourseType } from "@/types/api";

interface UseAllCourseProgressOptions {
    courseIds: string[];
    type: CourseType;
    enabled?: boolean;
}

/**
 * Hook to fetch progress for multiple courses in a single batch request
 * Optimized to reduce API calls and Vercel function invocations
 */
export function useAllCourseProgress({
    courseIds,
    type,
    enabled = true,
}: UseAllCourseProgressOptions) {
    return useQuery({
        queryKey: ["course-progress", type, courseIds.sort().join(",")],
        queryFn: async () => {
            // Use batch endpoint to fetch all progress in a single API call
            const progressMap = await getAllCourseProgresses(type, courseIds);
            return progressMap;
        },
        enabled: enabled && courseIds.length > 0,
        staleTime: 0,
        gcTime: 0,
    });
}
