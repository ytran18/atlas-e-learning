import { ReactNode } from "react";

import { Button } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";

interface CourseHeroSectionProps {
    title: string;
    description: string;
    badge?: string;
    onBack: () => void;
    onStartLearning?: () => void;
    children?: ReactNode;
}

export const CourseHeroSection = ({
    title,
    description,
    badge = "Khóa học ATLD",
    onBack,
    onStartLearning,
    children,
}: CourseHeroSectionProps) => {
    return (
        <div className="bg-gradient-to-br from-blue-400 via-blue-300 to-indigo-400 pt-6 pb-16 sm:pt-8 sm:pb-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
                {/* Back Button */}
                <div className="mb-6">
                    <Button
                        onClick={onBack}
                        variant="white"
                        leftSection={<IconArrowLeft size={18} />}
                        size="md"
                        radius="lg"
                    >
                        Quay lại danh sách khóa học
                    </Button>
                </div>

                {/* Course Header Card */}
                <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 relative overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full opacity-10 -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-400 to-pink-400 rounded-full opacity-10 -ml-24 -mb-24"></div>

                    <div className="relative z-10">
                        {/* Badge */}
                        <div className="inline-block mb-4">
                            <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-semibold rounded-full shadow-lg">
                                {badge}
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 leading-tight">
                            {title}
                        </h1>
                        <p className="text-base sm:text-lg text-gray-600 mb-8 leading-relaxed max-w-3xl">
                            {description}
                        </p>

                        {/* Course Stats - passed as children */}
                        {children}

                        {/* CTA Button */}
                        <Button
                            size="lg"
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                            radius="xl"
                            onClick={onStartLearning}
                        >
                            🚀 Bắt đầu học ngay
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
