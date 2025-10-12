import { IconClock, IconFile, IconVideo } from "@tabler/icons-react";

interface CourseStatsProps {
    totalLessons: number;
    totalQuestions: number;
    duration: string;
}

export const CourseStats = ({ totalLessons, totalQuestions, duration }: CourseStatsProps) => {
    return (
        <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gray-100 rounded">
                    <IconVideo className="h-4 w-4 text-gray-700" strokeWidth={1.5} />
                </div>
                <div>
                    <div className="text-xs text-gray-600">Bài học</div>
                    <span className="font-semibold text-gray-900 text-sm">
                        {totalLessons} video
                    </span>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gray-100 rounded">
                    <IconFile className="h-4 w-4 text-gray-700" strokeWidth={1.5} />
                </div>
                <div>
                    <div className="text-xs text-gray-600">Kiểm tra</div>
                    <span className="font-semibold text-gray-900 text-sm">
                        {totalQuestions} câu hỏi
                    </span>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gray-100 rounded">
                    <IconClock className="h-4 w-4 text-gray-700" strokeWidth={1.5} />
                </div>
                <div>
                    <div className="text-xs text-gray-600">Thời lượng</div>
                    <span className="font-semibold text-gray-900 text-sm">{duration}</span>
                </div>
            </div>
        </div>
    );
};
