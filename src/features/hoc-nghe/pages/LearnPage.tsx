"use client";

import { useState } from "react";

import { useParams } from "next/navigation";

import { LearnProvider } from "@/contexts/LearnContext";
import { useCourseDetail, useCourseProgress } from "@/hooks/api";

import { CourseLoading, DesktopLayout, MobileLayout } from "../_components/learn";

const LearnPage = () => {
    const { hocNgheId } = useParams();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // get course detail
    const { data: courseDetail, isLoading: isCourseDetailLoading } = useCourseDetail(
        "hoc-nghe",
        hocNgheId as string
    );

    console.log({ courseDetail });

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
