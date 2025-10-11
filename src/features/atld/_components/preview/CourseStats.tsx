import { IconClock, IconFile, IconVideo } from "@tabler/icons-react";

interface CourseStatsProps {
    totalLessons: number;
    totalQuestions: number;
    duration: string;
}

export const CourseStats = ({ totalLessons, totalQuestions, duration }: CourseStatsProps) => {
    return (
        <div className="flex flex-wrap gap-4 sm:gap-6 mb-8">
            <div className="flex items-center gap-3 bg-gradient-to-br from-blue-50 to-blue-100 px-4 sm:px-5 py-3 sm:py-4 rounded-xl shadow-md border-2 border-blue-200">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
                    <IconVideo className="h-5 w-5 text-white" />
                </div>
                <div>
                    <div className="text-xs text-gray-600 mb-0.5">Tổng số</div>
                    <span className="font-bold text-gray-900 text-lg">{totalLessons} video</span>
                </div>
            </div>
            <div className="flex items-center gap-3 bg-gradient-to-br from-green-50 to-green-100 px-4 sm:px-5 py-3 sm:py-4 rounded-xl shadow-md border-2 border-green-200">
                <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md">
                    <IconFile className="h-5 w-5 text-white" />
                </div>
                <div>
                    <div className="text-xs text-gray-600 mb-0.5">Bài kiểm tra</div>
                    <span className="font-bold text-gray-900 text-lg">
                        {totalQuestions} câu hỏi
                    </span>
                </div>
            </div>
            <div className="flex items-center gap-3 bg-gradient-to-br from-purple-50 to-purple-100 px-4 sm:px-5 py-3 sm:py-4 rounded-xl shadow-md border-2 border-purple-200">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md">
                    <IconClock className="h-5 w-5 text-white" />
                </div>
                <div>
                    <div className="text-xs text-gray-600 mb-0.5">Thời lượng</div>
                    <span className="font-bold text-gray-900 text-lg">{duration}</span>
                </div>
            </div>
        </div>
    );
};
