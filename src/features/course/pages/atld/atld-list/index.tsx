"use client";

import { useCourseList } from "@/api";
import CourseLoading from "@/features/course/components/list/course-loading";
import CourseListHeroSection from "@/features/course/components/list/hero-section";
import CourseListSection from "@/features/course/components/list/list-section";
import { useCourseCategorization } from "@/features/course/hooks/useCourseCategorization";

const AtldListPage = () => {
    const { data: courseList, isLoading: isLoadingCourseList } = useCourseList("atld");

    const { categorizedCourses } = useCourseCategorization({
        data: courseList,
        type: "atld",
    });

    if (!courseList || isLoadingCourseList) {
        return <CourseLoading />;
    }

    return (
        <div className="h-[calc(100vh-70px)] bg-white">
            <CourseListHeroSection data={courseList} />

            {/* Courses Grid */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50/30">
                <div className="max-w-7xl mx-auto">
                    {courseList.length !== 0 && (
                        <div className="mb-10 text-center">
                            <h2 className="text-3xl font-semibold text-gray-900 mb-3 tracking-tight">
                                Khám phá các khóa học
                            </h2>
                            <p className="text-lg text-gray-600 font-normal">
                                Chọn nhóm phù hợp với công việc của bạn
                            </p>
                        </div>
                    )}

                    <CourseListSection categorizedCourses={categorizedCourses} />
                </div>
            </div>
        </div>
    );
};

export default AtldListPage;
