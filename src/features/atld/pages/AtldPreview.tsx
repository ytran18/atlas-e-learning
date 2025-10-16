"use client";

import { useParams } from "next/navigation";

import { useCoursePreview, useCourseProgress } from "@/hooks/api";

import { AtldPreviewContainer } from "../_widgets/AtldPreviewContainer";

const AtldPreview = () => {
    const { atldId } = useParams();

    const { data, isLoading } = useCoursePreview("atld", atldId as string);

    const { data: progressData, isLoading: isProgressLoading } = useCourseProgress(
        "atld",
        atldId as string
    );

    const isJoined = !!progressData;

    if (!data || isLoading || isProgressLoading) {
        return null;
    }

    return <AtldPreviewContainer course={data} isJoined={isJoined} />;
};

export default AtldPreview;
