"use client";

import { useParams } from "next/navigation";

import { useCoursePreview, useCourseProgress } from "@/api";
import CoursePreviewContainer from "@/features/course/container/course-preview-container";
import { GetCoursePreviewResponse } from "@/types/api";

interface AtldPreviewProps {
    initialData?: GetCoursePreviewResponse;
}

const AtldPreviewPage = ({ initialData }: AtldPreviewProps) => {
    const { atldId } = useParams();

    const { data, isLoading } = useCoursePreview("atld", atldId as string, {
        initialData,
    });

    const { data: progressData, isLoading: isProgressLoading } = useCourseProgress(
        "atld",
        atldId as string
    );

    const isJoined = !!progressData;

    const isCompleted = progressData?.isCompleted;

    if (!data || isLoading) {
        return null;
    }

    return (
        <CoursePreviewContainer
            type="atld"
            course={data}
            isJoined={isJoined}
            isCompleted={isCompleted}
            isLoadingJoiabled={isProgressLoading}
        />
    );
};

export default AtldPreviewPage;
