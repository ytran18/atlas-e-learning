"use client";

import { useParams } from "next/navigation";

import { useCoursePreview, useCourseProgress } from "@/api";
import CoursePreviewContainer from "@/features/course/container/course-preview-container";
import { GetCoursePreviewResponse } from "@/types/api";

interface HocNghePreviewProps {
    initialData?: GetCoursePreviewResponse;
}

const HocNghePreviewPage = ({ initialData }: HocNghePreviewProps) => {
    const { hocNgheId } = useParams();

    const { data, isLoading } = useCoursePreview("hoc-nghe", hocNgheId as string, {
        initialData,
    });

    const { data: progressData, isLoading: isProgressLoading } = useCourseProgress(
        "hoc-nghe",
        hocNgheId as string
    );

    const isJoined = !!progressData;

    const isCompleted = progressData?.isCompleted;

    if (!data || isLoading) {
        return null;
    }

    return (
        <CoursePreviewContainer
            type="hoc-nghe"
            course={data}
            isJoined={isJoined}
            isCompleted={isCompleted}
            isLoadingJoiabled={isProgressLoading}
        />
    );
};

export default HocNghePreviewPage;
