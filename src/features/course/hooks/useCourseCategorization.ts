import { useMemo } from "react";

import { useAllCourseProgress } from "@/api/user/useAllCourseProgress";
import { CourseListItem, CourseProgress, GetCourseListResponse } from "@/types/api";

export type CourseStatus = "not-started" | "in-progress" | "incomplete" | "completed";

export interface CategorizedCourse extends CourseListItem {
    status: CourseStatus;
    progress?: CourseProgress;
}

export interface CategorizedCourses {
    inProgress: CategorizedCourse[];
    notStarted: CategorizedCourse[];
    incomplete: CategorizedCourse[];
    completed: CategorizedCourse[];
}

interface UseCourseCategorizationProps {
    data?: GetCourseListResponse;
    type: "atld" | "hoc-nghe";
}

export function useCourseCategorization({ data, type }: UseCourseCategorizationProps) {
    // Get progress for all courses
    const { data: progressData, isLoading: isProgressLoading } = useAllCourseProgress({
        courseIds: data?.map((course) => course.id) || [],
        type,
        enabled: !!data && data.length > 0,
    });

    const categorizedCourses = useMemo((): CategorizedCourses => {
        if (!data) return { inProgress: [], notStarted: [], incomplete: [], completed: [] };

        // Map courses attaching progress + status
        const courses: CategorizedCourse[] = data.map((course) => {
            const progress = progressData?.[course.id];

            let status: CourseStatus = "not-started";
            if (progress) {
                if (progress.isCompleted) {
                    status = "completed";
                } else if (progress.completedVideos.length > 0) {
                    status = "in-progress";
                } else {
                    status = "incomplete";
                }
            }

            return {
                ...course,
                status,
                progress,
            };
        });

        // Sort by sortNo (ascending). Items without sortNo go to the end.
        courses.sort((a, b) => {
            const aHas = typeof a.sortNo === "number";
            const bHas = typeof b.sortNo === "number";
            if (aHas && bHas) return (a.sortNo as number) - (b.sortNo as number);
            if (aHas) return -1; // a comes before b
            if (bHas) return 1; // b comes before a
            return 0; // both missing
        });

        return {
            inProgress: courses.filter((c) => c.status === "in-progress"),
            notStarted: courses.filter((c) => c.status === "not-started"),
            incomplete: courses.filter((c) => c.status === "incomplete"),
            completed: courses.filter((c) => c.status === "completed"),
        };
    }, [data, progressData]);

    return {
        categorizedCourses,
        isProgressLoading,
    };
}
