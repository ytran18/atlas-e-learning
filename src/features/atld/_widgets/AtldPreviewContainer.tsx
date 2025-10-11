"use client";

import { useParams, useRouter } from "next/navigation";

import { IconClipboardCheck, IconPlaylist, IconVideo } from "@tabler/icons-react";

import { Course } from "@/types/course";
import { navigationPaths } from "@/utils/navigationPaths";

import { CourseContentCard } from "../_components/preview/CourseContentCard";
import { CourseHeroSection } from "../_components/preview/CourseHeroSection";
import { CourseStats } from "../_components/preview/CourseStats";
import { Lesson, LessonList } from "../_components/preview/LessonList";

interface AtldPreviewContainerProps {
    course: Course;
    theoryLessons: Lesson[];
    practiceLessons: Lesson[];
}

export const AtldPreviewContainer = ({
    course,
    theoryLessons,
    practiceLessons,
}: AtldPreviewContainerProps) => {
    const router = useRouter();

    const { atldId } = useParams();

    const handleBack = () => {
        router.push(navigationPaths.ATLD);
    };

    const handleStartLearning = () => {
        router.push(`/atld/${atldId}/verify`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            {/* Hero Section with Gradient */}
            <CourseHeroSection
                title={course.title}
                description={course.description}
                onBack={handleBack}
                onStartLearning={handleStartLearning}
            >
                <CourseStats
                    totalLessons={course.lessons.length}
                    totalQuestions={10}
                    duration="~2 giờ"
                />
            </CourseHeroSection>

            {/* Course Content Section */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl -mt-12 pb-4">
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            📚 Nội dung khóa học
                        </h2>
                    </div>

                    {/* Theory Card */}
                    <CourseContentCard
                        icon={<IconPlaylist className="h-6 w-6 sm:h-7 sm:w-7 text-white" />}
                        title="1. Học lý thuyết"
                        description="Xem các video lý thuyết để hiểu rõ về an toàn lao động"
                        borderColor="blue"
                        iconGradient="blue"
                    >
                        <LessonList lessons={theoryLessons} hoverColor="blue" />
                    </CourseContentCard>

                    {/* Practice Card */}
                    <CourseContentCard
                        icon={<IconVideo className="h-6 w-6 sm:h-7 sm:w-7 text-white" />}
                        title="2. Học thực hành"
                        description="Xem các video thực hành để hiểu rõ về an toàn lao động"
                        borderColor="green"
                        iconGradient="green"
                    >
                        <LessonList lessons={practiceLessons} hoverColor="green" />
                    </CourseContentCard>

                    {/* Quiz Card */}
                    <CourseContentCard
                        icon={<IconClipboardCheck className="h-6 w-6 sm:h-7 sm:w-7 text-white" />}
                        title="3. Kiểm tra"
                        description="Hoàn thành bài kiểm tra để đánh giá kiến thức đã học"
                        borderColor="purple"
                        iconGradient="purple"
                    >
                        <div className="bg-purple-50 px-3 sm:px-4 py-2 sm:py-3 rounded-xl inline-block">
                            <p className="text-sm sm:text-base text-gray-800 font-semibold">
                                10 câu hỏi trắc nghiệm
                            </p>
                        </div>
                    </CourseContentCard>
                </div>
            </div>
        </div>
    );
};
