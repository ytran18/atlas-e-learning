"use client";

import { useEffect, useState } from "react";

import { redirect, useParams, useRouter } from "next/navigation";

import { useCourseDetail, useCourseProgress } from "@/api";
import { LearnProvider, useLearnContext } from "@/contexts/LearnContext";
import { DesktopLayout } from "@/features/shared";
import { HOC_NGHE_SLUG, navigationPaths } from "@/utils/navigationPaths";

import { CourseLoading, MobileLayout } from "../_components/learn";

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
    const { hocNgheId } = useParams();

    const router = useRouter();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // get course detail
    const { data: courseDetail, isLoading: isCourseDetailLoading } = useCourseDetail(
        "hoc-nghe",
        hocNgheId as string
    );

    // get course progress
    const { data: progressData, isLoading: isProgressLoading } = useCourseProgress(
        "hoc-nghe",
        hocNgheId as string,
        () => {
            redirect(navigationPaths.LANDING_PAGE);
        }
    );

    useEffect(() => {
        if (progressData) {
            if (progressData.isCompleted) {
                router.replace(
                    `${navigationPaths.HOC_NGHE_LEARN.replace(`[${HOC_NGHE_SLUG}]`, hocNgheId as string)}`
                );
                return;
            }

            router.replace(
                `${navigationPaths.HOC_NGHE_LEARN.replace(`[${HOC_NGHE_SLUG}]`, hocNgheId as string)}?section=${progressData?.currentSection ?? "theory"}&video=${progressData?.currentVideoIndex ?? 0}`
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
                />
                <DesktopLayout courseType="hoc-nghe" />;
            </LearnProvider>
        </div>
    );
};

export default LearnPage;
