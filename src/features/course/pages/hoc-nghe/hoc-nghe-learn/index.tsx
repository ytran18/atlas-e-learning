"use client";

import { useEffect, useState } from "react";

import { redirect, useParams, useRouter } from "next/navigation";

import { useCourseDetail, useCourseProgress } from "@/api";
import { LearnProvider } from "@/contexts/LearnContext";
import CourseLoading from "@/features/course/components/list/course-loading";
import HashNavigationHandler from "@/features/course/container/hash-navigation-handler";
import DesktopLearnLayout from "@/features/course/layouts/learn/desktop";
import MobileLearnLayout from "@/features/course/layouts/learn/mobile";
import { HOC_NGHE_SLUG, navigationPaths } from "@/utils/navigationPaths";

const HocNgheLearnPage = () => {
    const { hocNgheId } = useParams();

    const router = useRouter();

    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

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
                <MobileLearnLayout
                    title={courseDetail.title}
                    isSidebarOpen={isSidebarOpen}
                    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    onCloseSidebar={() => setIsSidebarOpen(false)}
                    courseType="hoc-nghe"
                />
                <DesktopLearnLayout courseType="hoc-nghe" />;
            </LearnProvider>
        </div>
    );
};

export default HocNgheLearnPage;
