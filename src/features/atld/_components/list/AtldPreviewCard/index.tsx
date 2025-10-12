"use client";

import { useRouter } from "next/navigation";

import { IconBook, IconClipboardCheck, IconPlayerPlay } from "@tabler/icons-react";

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

    // Generate a softer gradient based on course id
    const gradients = [
        "from-blue-500/90 to-blue-600/90",
        "from-indigo-500/90 to-indigo-600/90",
        "from-violet-500/90 to-violet-600/90",
        "from-purple-500/90 to-purple-600/90",
        "from-sky-500/90 to-sky-600/90",
        "from-cyan-500/90 to-cyan-600/90",
    ];
    const courseIndex = parseInt(course.id.replace("course", "")) - 1;
    const gradient = gradients[courseIndex % gradients.length];

    return (
        <div
            onClick={handleNavigateToPreview}
            className="group bg-white rounded-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-full cursor-pointer"
        >
            {/* Thumbnail with softer gradient */}
            <div
                className={`relative h-44 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}
            >
                <div className="absolute inset-0 bg-black/5"></div>
                <div className="text-white text-center p-6 relative z-10">
                    <div className="text-4xl font-light mb-3">📚</div>
                    <div className="text-base font-medium tracking-wide">
                        {course.title.split("-")[1]?.trim() || course.title}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col">
                {/* Category badge */}
                <div className="mb-3">
                    <span className="inline-block px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded">
                        An toàn Lao động
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#0056D2] transition-colors leading-snug">
                    {course.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1 leading-relaxed">
                    {course.description}
                </p>

                {/* Stats */}
                <div className="space-y-2.5 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                        <IconBook className="h-4 w-4 text-gray-500" strokeWidth={1.5} />
                        <span>{numberOfTheoryLessons} bài lý thuyết</span>
                        <span className="text-gray-300">•</span>
                        <IconPlayerPlay className="h-4 w-4 text-gray-500" strokeWidth={1.5} />
                        <span>{numberOfPracticeLessons} bài thực hành</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                        <IconClipboardCheck className="h-4 w-4 text-gray-500" strokeWidth={1.5} />
                        <span>{numberOfTheoryLessons} câu hỏi kiểm tra</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AtldPreviewCard;
