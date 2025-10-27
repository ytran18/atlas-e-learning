import { useCourseList } from "@/hooks/api";
import { GetCourseListResponse } from "@/types/api";

import CourseListContainer from "../_components/list/CourseListContainer";
import HocNgheHeroSection from "../_components/list/HocNgheHeroSection";
import HocNgheLoadingState from "../_components/list/HocNgheLoadingState";
import { useCourseCategorization } from "../hooks/useCourseCategorization";

interface HocNgheCourseListContainerProps {
    initialData?: GetCourseListResponse;
}

const HocNgheCourseListContainer = ({ initialData }: HocNgheCourseListContainerProps) => {
    const { data, isLoading } = useCourseList("hoc-nghe", {
        initialData,
    });

    const { categorizedCourses, isProgressLoading } = useCourseCategorization({
        data,
        type: "hoc-nghe",
    });

    if (!data || isLoading || isProgressLoading) {
        return <HocNgheLoadingState />;
    }

    return (
        <div className="min-h-screen bg-white">
            <HocNgheHeroSection data={data} />

            {/* Courses Grid */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="mb-8 sm:mb-12 text-center">
                    <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2 tracking-tight">
                        Các khóa học có sẵn
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600">
                        Chọn khóa học phù hợp với nhu cầu học tập của bạn
                    </p>
                </div>

                <CourseListContainer categorizedCourses={categorizedCourses} />
            </div>
        </div>
    );
};

export default HocNgheCourseListContainer;
