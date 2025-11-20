"use client";

import { useClerk } from "@clerk/nextjs";

import { useGetUserProgress } from "@/api/user/useGetUserProgress";
import CourseLoading from "@/features/course/components/list/course-loading";
import CourseListHeroSection from "@/features/course/components/list/hero-section";
import CourseListSection from "@/features/course/components/list/list-section";

const HocNgheListPage = () => {
    const { user } = useClerk();

    const { data: userProgress, isLoading: isLoadingUserProgress } = useGetUserProgress(
        user?.id || "",
        "hoc-nghe"
    );

    if (!userProgress || isLoadingUserProgress) {
        return <CourseLoading />;
    }

    const hasAnyCourses =
        userProgress?.inProgress?.length > 0 ||
        userProgress?.notStarted?.length > 0 ||
        userProgress?.incomplete?.length > 0 ||
        userProgress?.completed?.length > 0;

    const totalCourses =
        userProgress?.inProgress?.length +
        userProgress?.notStarted?.length +
        userProgress?.incomplete?.length +
        userProgress?.completed?.length;

    return (
        <div className="h-[calc(100vh-70px)] bg-white">
            <CourseListHeroSection totalCourses={totalCourses} />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                {hasAnyCourses && (
                    <div className="mb-8 sm:mb-12 text-center">
                        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2 tracking-tight">
                            Các khóa học có sẵn
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600">
                            Chọn khóa học phù hợp với nhu cầu học tập của bạn
                        </p>
                    </div>
                )}

                <CourseListSection categorizedCourses={userProgress} />
            </div>
        </div>
    );
};

export default HocNgheListPage;
