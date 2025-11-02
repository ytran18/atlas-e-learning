"use client";

import { useParams } from "next/navigation";

import { useCoursePreview, useCourseProgress } from "@/api";
import { GetCoursePreviewResponse } from "@/types/api";

import { HocNghePreviewContainer } from "../_widgets/HocNghePreviewContainer";

interface HocNghePreviewProps {
    initialData?: GetCoursePreviewResponse;
}

const HocNghePreview = ({ initialData }: HocNghePreviewProps) => {
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
        <HocNghePreviewContainer
            course={data}
            isJoined={isJoined}
            isLoadingJoiabled={isProgressLoading}
            isCompleted={isCompleted}
        />
    );
};

export default HocNghePreview;
