"use client";

import { useParams } from "next/navigation";

import { useCoursePreview, useCourseProgress } from "@/hooks/api";
import { GetCoursePreviewResponse } from "@/types/api";

import { AtldPreviewContainer } from "../_widgets/AtldPreviewContainer";

interface AtldPreviewProps {
    initialData?: GetCoursePreviewResponse;
}

const AtldPreview = ({ initialData }: AtldPreviewProps) => {
    const { atldId } = useParams();

    const { data, isLoading } = useCoursePreview("atld", atldId as string, {
        initialData,
    });

    const { data: progressData, isLoading: isProgressLoading } = useCourseProgress(
        "atld",
        atldId as string
    );

    const isJoined = !!progressData;

    if (!data || isLoading) {
        return null;
    }

    return (
        <AtldPreviewContainer
            course={data}
            isJoined={isJoined}
            isLoadingJoiabled={isProgressLoading}
        />
    );
};

export default AtldPreview;
