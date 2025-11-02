import { IconPlayerPlay } from "@tabler/icons-react";

import { Video } from "@/types/api";

export interface Lesson {
    id: string;
    title: string;
    duration?: string;
}

interface LessonListProps {
    lessons: Video[];
}

export const LessonList = ({ lessons }: LessonListProps) => {
    return (
        <ul className="space-y-2">
            {lessons.map((lesson, index) => (
                <li
                    key={lesson.title}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                    <IconPlayerPlay
                        className="h-5 w-5 text-gray-400 group-hover:text-gray-600 flex-shrink-0"
                        strokeWidth={1.5}
                    />
                    <span className="text-sm text-gray-700 flex-1 min-w-[150px]">
                        {index + 1}. {lesson.title}
                    </span>
                </li>
            ))}
        </ul>
    );
};
