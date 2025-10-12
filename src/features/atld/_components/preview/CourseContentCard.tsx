import { ReactNode } from "react";

interface CourseContentCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    step: string;
    children: ReactNode;
}

export const CourseContentCard = ({
    icon,
    title,
    description,
    step,
    children,
}: CourseContentCardProps) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4 mb-4">
                {/* Step Number */}
                <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-900 text-white rounded-lg flex items-center justify-center font-semibold">
                        {step}
                    </div>
                </div>

                <div className="flex-1">
                    {/* Icon & Title */}
                    <div className="flex items-center gap-2 mb-2">
                        <div className="text-gray-700">{icon}</div>
                        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
                </div>
            </div>

            {/* Content */}
            <div className="pl-12">{children}</div>
        </div>
    );
};
