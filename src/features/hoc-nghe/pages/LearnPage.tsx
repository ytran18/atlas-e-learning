"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { LearnProvider, useLearnContext } from "@/contexts/LearnContext";
import { useCourseDetail, useCourseProgress } from "@/hooks/api";
import { useAutoCapture } from "@/hooks/useAutoCapture";

import { CourseLoading, DesktopLayout, MobileLayout } from "../_components/learn";

// Component to handle URL hash navigation
const HashNavigationHandler = () => {
    const { navigateToVideo, navigateToExam } = useLearnContext();

    useEffect(() => {
        const hash = window.location.hash.substring(1); // Remove # from hash
        if (!hash) return;

        // Parse hash format: "section-index" or "exam"
        if (hash === "exam") {
            navigateToExam();
        } else {
            const [section, indexStr] = hash.split("-");
            const index = parseInt(indexStr, 10);

            if (section && !isNaN(index)) {
                navigateToVideo(section, index);
            }
        }
    }, [navigateToVideo, navigateToExam]);

    return null;
};

// Component to handle auto capture
const AutoCaptureHandler = ({
    groupId,
    courseType = "hoc-nghe",
}: {
    groupId: string;
    courseType?: "atld" | "hoc-nghe";
}) => {
    const { currentSection, currentVideoIndex, learnDetail, progress } = useLearnContext();

    // Check if we already have a finish image
    const hasCaptured = !!progress.finishImageUrl;

    useAutoCapture({
        courseType,
        groupId,
        currentSection,
        currentVideoIndex,
        learnDetail,
        hasCaptured,
    });

    return null;
};

const LearnPage = () => {
    const { hocNgheId } = useParams();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // get course detail
    const { data: courseDetail, isLoading: isCourseDetailLoading } = useCourseDetail(
        "hoc-nghe",
        hocNgheId as string
    );

    // get course progress
    const { data: progressData, isLoading: isProgressLoading } = useCourseProgress(
        "hoc-nghe",
        hocNgheId as string
    );

    if (isCourseDetailLoading || !courseDetail || isProgressLoading || !progressData) {
        return <CourseLoading />;
    }

    return (
        <div className="h-[calc(100vh-70px)] w-full overflow-hidden">
            <LearnProvider progress={progressData} learnDetail={courseDetail}>
                <HashNavigationHandler />
                <AutoCaptureHandler groupId={hocNgheId as string} courseType="hoc-nghe" />
                <MobileLayout
                    title={courseDetail.title}
                    isSidebarOpen={isSidebarOpen}
                    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    onCloseSidebar={() => setIsSidebarOpen(false)}
                />

                <DesktopLayout />
            </LearnProvider>
        </div>
    );
};

export default LearnPage;
