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
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
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
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl py-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2 tracking-tight">
                        Nội dung khóa học
                    </h2>
                    <p className="text-sm text-gray-600">
                        Hoàn thành tất cả các phần để nhận chứng chỉ
                    </p>
                </div>

                <div className="space-y-4">
                    {/* Theory Card */}
                    <CourseContentCard
                        icon={<IconPlaylist className="h-6 w-6" strokeWidth={1.5} />}
                        title="1. Học lý thuyết"
                        description="Xem các video lý thuyết để hiểu rõ về an toàn lao động"
                        step="01"
                    >
                        <LessonList lessons={theoryLessons} />
                    </CourseContentCard>

                    {/* Practice Card */}
                    <CourseContentCard
                        icon={<IconVideo className="h-6 w-6" strokeWidth={1.5} />}
                        title="2. Học thực hành"
                        description="Xem các video thực hành để hiểu rõ về an toàn lao động"
                        step="02"
                    >
                        <LessonList lessons={practiceLessons} />
                    </CourseContentCard>

                    {/* Quiz Card */}
                    <CourseContentCard
                        icon={<IconClipboardCheck className="h-6 w-6" strokeWidth={1.5} />}
                        title="3. Kiểm tra"
                        description="Hoàn thành bài kiểm tra để đánh giá kiến thức đã học"
                        step="03"
                    >
                        <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 inline-block">
                            <p className="text-sm text-gray-700 font-medium">
                                10 câu hỏi trắc nghiệm • 20 phút
                            </p>
                        </div>
                    </CourseContentCard>
                </div>
            </div>
        </div>
    );
};
