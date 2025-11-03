import { useCourseList } from "@/api";
import { GetCourseListResponse } from "@/types/api";

import AtldHeroSection from "../_components/list/AtldHeroSection";
import AtldLoadingState from "../_components/list/AtldLoadingState";
import CourseListContainer from "../_components/list/CourseListContainer";
import { useCourseCategorization } from "../hooks/useCourseCategorization";

interface AtldCourseListContainerProps {
    initialData?: GetCourseListResponse;
}

const AtldCourseListContainer = ({ initialData }: AtldCourseListContainerProps) => {
    const { data, isLoading } = useCourseList("atld", {
        // initialData,
    });

    const { categorizedCourses, isProgressLoading } = useCourseCategorization({
        data,
        type: "atld",
    });

    console.log({ atldData: data });

    if (!data || isLoading || isProgressLoading) {
        return <AtldLoadingState />;
    }

    return (
        <div className="h-[calc(100vh-70px)] bg-white">
            <AtldHeroSection data={data} />

            {/* Courses Grid */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50/30">
                <div className="max-w-7xl mx-auto">
                    {data.length !== 0 && (
                        <div className="mb-10 text-center">
                            <h2 className="text-3xl font-semibold text-gray-900 mb-3 tracking-tight">
                                Khám phá các khóa học
                            </h2>
                            <p className="text-lg text-gray-600 font-normal">
                                Chọn nhóm phù hợp với công việc của bạn
                            </p>
                        </div>
                    )}

                    <CourseListContainer categorizedCourses={categorizedCourses} />
                </div>
            </div>
        </div>
    );
};

export default AtldCourseListContainer;
