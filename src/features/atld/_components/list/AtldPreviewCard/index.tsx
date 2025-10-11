"use client";

import { useRouter } from "next/navigation";

import { Button } from "@mantine/core";
import { IconArrowRight, IconBook, IconClipboardCheck, IconPlayerPlay } from "@tabler/icons-react";

import { Course, LessionType } from "@/types/course";

type AtldPreviewCardProps = {
    course: Course;
};

const AtldPreviewCard = ({ course }: AtldPreviewCardProps) => {
    const router = useRouter();

    const numberOfPracticeLessons = course.lessons.filter(
        (lesson) => lesson.type === LessionType.PRACTICE
    ).length;

    const numberOfTheoryLessons = course.lessons.filter(
        (lesson) => lesson.type === LessionType.THEORY
    ).length;

    const handleNavigateToPreview = () => {
        router.push(`/atld/${course.id}`);
    };

    return (
        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-blue-200 flex flex-col h-full">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                <h3 className="text-xl sm:text-2xl font-bold relative z-10">{course.title}</h3>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6 flex-1">
                    {course.description}
                </p>

                {/* Stats */}
                <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                        <div className="p-2 bg-blue-500 rounded-lg flex-shrink-0">
                            <IconPlayerPlay className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm sm:text-base text-gray-700 font-medium">
                            {numberOfPracticeLessons} bài học thực hành
                        </span>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors">
                        <div className="p-2 bg-green-500 rounded-lg flex-shrink-0">
                            <IconBook className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm sm:text-base text-gray-700 font-medium">
                            {numberOfTheoryLessons} bài học lý thuyết
                        </span>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors">
                        <div className="p-2 bg-purple-500 rounded-lg flex-shrink-0">
                            <IconClipboardCheck className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm sm:text-base text-gray-700 font-medium">
                            {numberOfTheoryLessons} câu hỏi kiểm tra
                        </span>
                    </div>
                </div>

                {/* Button */}
                <Button
                    onClick={handleNavigateToPreview}
                    rightSection={<IconArrowRight size={16} />}
                    fullWidth
                    size="md"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                    radius="xl"
                >
                    Xem chi tiết
                </Button>
            </div>
        </div>
    );
};

export default AtldPreviewCard;
