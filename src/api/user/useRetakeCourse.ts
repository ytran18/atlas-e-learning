import { UseMutationOptions, useMutation } from "@tanstack/react-query";

import { trackRetakeCourseSuccess } from "@/libs/mixpanel";
import { retakeCourse } from "@/services/api.client";
import { CourseType, RetakeCourseResponse } from "@/types/api";

/**
 * Interface for mutation variables
 */
interface RetakeCourseVariables {
    userId: string;
    groupId: string;
    // Additional tracking data
    courseType: CourseType;
    courseName: string;
    userName: string;
}

/**
 * Hook for retaking a course (full course reset with archive)
 * This is different from retake exam - it archives old progress and resets everything
 */
export function useRetakeCourse(
    options?: Omit<
        UseMutationOptions<RetakeCourseResponse, Error, RetakeCourseVariables, unknown>,
        "mutationFn"
    >
) {
    return useMutation({
        mutationFn: ({ userId, groupId }: RetakeCourseVariables) =>
            retakeCourse(userId, groupId) as Promise<RetakeCourseResponse>,
        onSuccess: (data, variables, context, mutation) => {
            // Track successful course retake
            trackRetakeCourseSuccess({
                course_type: variables.courseType,
                course_id: variables.groupId,
                courseName: variables.courseName,
                timestamp: Date.now(),
                userId: variables.userId,
                userName: variables.userName,
            });

            // Call onSuccess callback if provided
            if (options?.onSuccess) {
                options.onSuccess(data, variables, context, mutation);
            }
        },
        ...options,
    });
}
