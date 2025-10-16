import { ReactNode } from "react";

import { Button } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";

interface CourseHeroSectionProps {
    title: string;
    description: string;
    badge?: string;
    isJoined: boolean;
    onBack: () => void;
    onStartLearning?: (isJoined: boolean) => void;
    children?: ReactNode;
}

export const CourseHeroSection = ({
    title,
    description,
    badge = "An toàn Lao động",
    isJoined,
    onBack,
    onStartLearning,
    children,
}: CourseHeroSectionProps) => {
    return (
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 border-b border-gray-200">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl py-6 sm:py-8">
                {/* Back Button */}
                <div className="mb-6">
                    <Button
                        onClick={onBack}
                        variant="subtle"
                        leftSection={<IconArrowLeft size={18} />}
                        size="sm"
                        className="text-gray-700 hover:bg-white/80"
                    >
                        Quay lại
                    </Button>
                </div>

                {/* Course Header */}
                <div className="max-w-4xl">
                    {/* Badge */}
                    <div className="mb-4">
                        <span className="inline-block px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                            {badge}
                        </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-semibold mb-4 text-gray-900 tracking-tight leading-tight">
                        {title}
                    </h1>
                    <p className="text-sm text-gray-700 mb-6 leading-relaxed font-normal max-w-3xl">
                        {description}
                    </p>

                    {/* Course Stats - passed as children */}
                    {children}

                    {/* CTA Button */}
                    <Button
                        size="sm"
                        onClick={() => onStartLearning?.(isJoined)}
                        className="bg-gray-900 hover:bg-gray-800"
                        radius="md"
                    >
                        {isJoined ? "Tiếp tục học" : "Bắt đầu học ngay"}
                    </Button>
                </div>
            </div>
        </div>
    );
};
