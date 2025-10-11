import { IconCheck } from "@tabler/icons-react";

export interface Lesson {
    id: string;
    title: string;
    duration?: string;
}

interface LessonListProps {
    lessons: Lesson[];
    hoverColor?: "blue" | "green" | "purple";
}

export const LessonList = ({ lessons, hoverColor = "blue" }: LessonListProps) => {
    const hoverColorClass = {
        blue: "hover:bg-blue-50",
        green: "hover:bg-green-50",
        purple: "hover:bg-purple-50",
    }[hoverColor];

    return (
        <ul className="space-y-2 sm:space-y-3">
            {lessons.map((lesson) => (
                <li
                    key={lesson.id}
                    className={`flex flex-wrap items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg ${hoverColorClass} transition-colors group`}
                >
                    <IconCheck className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-gray-700 font-medium flex-1 min-w-[150px]">
                        {lesson.title}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">
                        {lesson.duration || "10 phút"}
                    </span>
                </li>
            ))}
        </ul>
    );
};
