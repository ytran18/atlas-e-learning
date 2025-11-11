"use client";

import { useCourseList } from "@/api";
import CourseLoading from "@/features/course/components/list/course-loading";
import CourseListHeroSection from "@/features/course/components/list/hero-section";
import CourseListSection from "@/features/course/components/list/list-section";
import { useCourseCategorization } from "@/features/course/hooks/useCourseCategorization";

const HocNgheListPage = () => {
    const { data: courseList, isLoading: isLoadingCourseList } = useCourseList("hoc-nghe");

    const { categorizedCourses } = useCourseCategorization({
        data: courseList,
        type: "hoc-nghe",
    });

    if (!courseList || isLoadingCourseList) {
        return <CourseLoading />;
    }

    return (
        <div className="h-[calc(100vh-70px)] bg-white">
            <CourseListHeroSection data={courseList} />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                {courseList.length !== 0 && (
                    <div className="mb-8 sm:mb-12 text-center">
                        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2 tracking-tight">
                            Các khóa học có sẵn
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600">
                            Chọn khóa học phù hợp với nhu cầu học tập của bạn
                        </p>
                    </div>
                )}

                <CourseListSection categorizedCourses={categorizedCourses} />
            </div>
        </div>
    );
};

export default HocNgheListPage;
