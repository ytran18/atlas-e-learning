"use client";

import { useState } from "react";

import Link from "next/link";

import { IconBook, IconClipboardCheck, IconPlayerPlay } from "@tabler/icons-react";

import { CourseListItem } from "@/types/api";

type HocNghePreviewCardProps = {
    course: CourseListItem;
};

const HocNghePreviewCard = ({ course }: HocNghePreviewCardProps) => {
    const [isNavigating, setIsNavigating] = useState(false);

    return (
        <Link
            href={`/hoc-nghe/${course.id}`}
            prefetch={true}
            onClick={() => setIsNavigating(true)}
            className={`group bg-white rounded-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-full cursor-pointer relative ${
                isNavigating ? "opacity-75" : ""
            }`}
        >
            {/* Thumbnail with softer gradient */}
            <div
                className={`relative h-44 bg-gradient-to-br from-green-500/90 to-green-600/90 flex items-center justify-center overflow-hidden`}
            >
                <div className="absolute inset-0 bg-black/5" />
                <div className="text-white text-center p-6 relative z-10">
                    <div className="text-4xl font-light mb-3">🎧</div>

                    <div className="text-base font-medium tracking-wide">
                        {course.title.split("-")[1]?.trim() || course.title}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col">
                {/* Category badge */}
                <div className="mb-3">
                    <span className="inline-block px-2.5 py-1 text-xs font-medium text-green-700 bg-green-50 rounded">
                        Học Nghề
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#059669] transition-colors leading-snug">
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

                        <span>{course?.numberOfTheory || 0} bài lý thuyết</span>

                        <span className="text-gray-300">•</span>

                        <IconPlayerPlay className="h-4 w-4 text-gray-500" strokeWidth={1.5} />

                        <span>{course?.numberOfPractice || 0} bài thực hành</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                        <IconClipboardCheck className="h-4 w-4 text-gray-500" strokeWidth={1.5} />

                        <span>{course?.totalQuestionOfExam || 0} câu hỏi kiểm tra</span>
                    </div>
                </div>
            </div>

            {/* Loading overlay */}
            {isNavigating && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                    <div className="flex items-center gap-2 text-green-600">
                        <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm font-medium">Đang tải khóa học...</span>
                    </div>
                </div>
            )}
        </Link>
    );
};

export default HocNghePreviewCard;
