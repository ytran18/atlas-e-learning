"use client";

import { useClerk } from "@clerk/nextjs";

import { useGetUserProgress } from "@/api/user/useGetUserProgress";
import CourseLoading from "@/features/course/components/list/course-loading";
import CourseListHeroSection from "@/features/course/components/list/hero-section";
import CourseListSection from "@/features/course/components/list/list-section";

const AtldListPage = () => {
    const { user } = useClerk();

    const { data: userProgress, isLoading: isLoadingUserProgress } = useGetUserProgress(
        user?.id || "",
        "atld"
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

            {/* Courses Grid */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50/30">
                <div className="max-w-7xl mx-auto">
                    {hasAnyCourses && (
                        <div className="mb-10 text-center">
                            <h2 className="text-3xl font-semibold text-gray-900 mb-3 tracking-tight">
                                Khám phá các khóa học
                            </h2>
                            <p className="text-lg text-gray-600 font-normal">
                                Chọn nhóm phù hợp với công việc của bạn
                            </p>
                        </div>
                    )}

                    <CourseListSection categorizedCourses={userProgress} />
                </div>
            </div>
        </div>
    );
};

export default AtldListPage;
