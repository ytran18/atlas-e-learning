"use client";

import { useParams } from "next/navigation";

import { useCoursePreview } from "@/hooks/api";

import { AtldPreviewContainer } from "../_widgets/AtldPreviewContainer";

const AtldPreview = () => {
    const { atldId } = useParams();

    const { data, isLoading } = useCoursePreview("atld", atldId as string);

    if (!data || isLoading) {
        return null;
    }

    return <AtldPreviewContainer course={data} />;
};

export default AtldPreview;
