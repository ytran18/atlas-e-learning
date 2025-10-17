"use client";

import { useState } from "react";

import { useParams } from "next/navigation";

import { LearnProvider } from "@/contexts/LearnContext";
import { useCourseDetail, useCourseProgress } from "@/hooks/api";

import { DesktopLayout, MobileLayout } from "../_components/learn";

const LearnPage = () => {
    const { atldId } = useParams();

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

    if (isCourseDetailLoading || !courseDetail || isProgressLoading || !progressData) {
        return null;
    }

    return (
        <div className="h-[calc(100vh-70px)] w-screen">
            <div className="h-full w-full">
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
        </div>
    );
};

export default LearnPage;
