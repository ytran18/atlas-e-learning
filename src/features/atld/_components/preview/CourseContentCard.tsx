import { ReactNode } from "react";

import { Card } from "@mantine/core";

interface CourseContentCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    borderColor?: "blue" | "green" | "purple";
    iconGradient?: "blue" | "green" | "purple";
    children: ReactNode;
}

export const CourseContentCard = ({
    icon,
    title,
    description,
    borderColor = "blue",
    iconGradient = "blue",
    children,
}: CourseContentCardProps) => {
    const borderColorClass = {
        blue: "border-blue-100 hover:border-blue-200",
        green: "border-green-100 hover:border-green-200",
        purple: "border-purple-100 hover:border-purple-200",
    }[borderColor];

    const iconGradientClass = {
        blue: "from-blue-500 to-blue-600",
        green: "from-green-500 to-green-600",
        purple: "from-purple-500 to-purple-600",
    }[iconGradient];

    return (
        <Card
            withBorder
            padding="md"
            radius="xl"
            className={`border-2 ${borderColorClass} transition-all hover:shadow-xl bg-white`}
        >
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-5">
                <div
                    className={`p-3 sm:p-4 bg-gradient-to-br ${iconGradientClass} rounded-xl shadow-lg flex-shrink-0`}
                >
                    {icon}
                </div>
                <div className="flex-1 w-full min-w-0">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 text-gray-900">
                        {title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                        {description}
                    </p>
                    {children}
                </div>
            </div>
        </Card>
    );
};
