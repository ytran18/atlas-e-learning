import { ReactNode } from "react";

interface CourseSectionHeaderProps {
    icon: ReactNode;
    title: string;
    count: number;
    badgeColor: string;
    textColor: string;
}

const CourseSectionHeader = ({
    icon,
    title,
    count,
    badgeColor,
    textColor,
}: CourseSectionHeaderProps) => {
    return (
        <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2">
                {icon}
                <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            </div>
            <span
                className={`px-3 py-1 ${badgeColor} ${textColor} text-sm font-medium rounded-full`}
            >
                {count} khóa học
            </span>
        </div>
    );
};

export default CourseSectionHeader;
