"use client";

import { useParams } from "next/navigation";

import { LearnProvider } from "@/contexts/LearnContext";
import { useCourseDetail, useCourseProgress } from "@/hooks/api";

import LearnExam from "../_components/learn/LearnExam";
import LearnPractice from "../_components/learn/LearnPractice";
import LearnSidebar from "../_components/learn/LearnSidebar";
import LearnSteps from "../_components/learn/LearnSteps";
import LearnTheory from "../_components/learn/LearnTheory";

const LearnPage = () => {
    const { atldId } = useParams();

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
                    <div className="flex items-center gap-x-8 h-full w-full">
                        <LearnSidebar />

                        <LearnSteps
                            slots={{
                                Theory: () => <LearnTheory />,
                                Practice: () => <LearnPractice />,
                                Exam: () => <LearnExam />,
                            }}
                        />
                    </div>
                </LearnProvider>
            </div>
        </div>
    );
};

export default LearnPage;
