"use client";

import { IconClipboardCheck, IconPlaylist, IconVideo } from "@tabler/icons-react";

import { CoursePreview } from "@/types/api";

import { CourseContentCard } from "../_components/preview/CourseContentCard";
import { CourseHeroSection } from "../_components/preview/CourseHeroSection";
import { CourseStats } from "../_components/preview/CourseStats";
import { LessonList } from "../_components/preview/LessonList";

interface AtldPreviewContainerProps {
    course: CoursePreview;
    isJoined: boolean;
    isLoadingJoiabled: boolean;
}

export const AtldPreviewContainer = ({
    course,
    isJoined,
    isLoadingJoiabled,
}: AtldPreviewContainerProps) => {
    const totlaLessons = course.theory.videos.length + course.practice.videos.length;

    return (
        <div className="h-[calc(100vh-70px)] bg-white">
            {/* Hero Section */}
            <CourseHeroSection
                isJoined={isJoined}
                title={course.title}
                description={course.description}
                isLoadingJoiabled={isLoadingJoiabled}
            >
                <CourseStats totalLessons={totlaLessons} totalQuestions={10} />
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
                        <LessonList lessons={course.theory.videos} />
                    </CourseContentCard>

                    {/* Practice Card */}
                    <CourseContentCard
                        icon={<IconVideo className="h-6 w-6" strokeWidth={1.5} />}
                        title="2. Học thực hành"
                        description="Xem các video thực hành để hiểu rõ về an toàn lao động"
                        step="02"
                    >
                        <LessonList lessons={course.practice.videos} />
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
                                {course.totalQuestionOfExam} câu hỏi trắc nghiệm •{" "}
                                {course.totalQuestionOfExam * 2} phút
                            </p>
                        </div>
                    </CourseContentCard>
                </div>
            </div>
        </div>
    );
};
