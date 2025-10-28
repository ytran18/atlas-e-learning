"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { LearnProvider, useLearnContext } from "@/contexts/LearnContext";
import { DesktopLayout, MobileLayout } from "@/features/shared/_components/learn";
import { useCourseDetail, useCourseProgress } from "@/hooks/api";
import { ATLD_SLUG, navigationPaths } from "@/utils/navigationPaths";

import { CourseLoading } from "../_components/learn";

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

const LearnPage = () => {
    const { atldId } = useParams();

    const router = useRouter();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // get course detail
    const { data: courseDetail, isLoading: isCourseDetailLoading } = useCourseDetail(
        "atld",
        atldId as string
    );

    // get course progress
    const { data: progressData, isLoading: isProgressLoading } = useCourseProgress(
        "atld",
        atldId as string
    );

    useEffect(() => {
        if (progressData) {
            router.replace(
                `${navigationPaths.ATLD_LEARN.replace(`[${ATLD_SLUG}]`, atldId as string)}?section=${progressData?.currentSection ?? "theory"}&video=${progressData?.currentVideoIndex ?? 0}`
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [progressData]);

    if (isCourseDetailLoading || !courseDetail || isProgressLoading || !progressData) {
        return <CourseLoading />;
    }

    return (
        <div className="h-[calc(100vh-70px)] w-full overflow-hidden">
            <LearnProvider progress={progressData} learnDetail={courseDetail}>
                <HashNavigationHandler />

                <MobileLayout
                    title={courseDetail.title}
                    isSidebarOpen={isSidebarOpen}
                    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    onCloseSidebar={() => setIsSidebarOpen(false)}
                    courseType="atld"
                />

                <DesktopLayout courseType="atld" />
            </LearnProvider>
        </div>
    );
};

export default LearnPage;
