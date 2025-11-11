import { ReactNode } from "react";

import { CategorizedCourse } from "@/features/course/hooks/useCourseCategorization";

import CourseSectionHeader from "../course-section-header";
import CoursePreviewCard from "../preview-card";

interface CourseSectionProps {
    icon: ReactNode;
    title: string;
    courses: CategorizedCourse[];
    badgeColor: string;
    textColor: string;
    statusBadgeColor: string;
    statusIcon: ReactNode;
    statusText: string;
}

const CourseSection = ({
    icon,
    title,
    courses,
    badgeColor,
    textColor,
    statusBadgeColor,
    statusIcon,
    statusText,
}: CourseSectionProps) => {
    if (courses.length === 0) return null;

    return (
        <div className="mb-12">
            <CourseSectionHeader
                icon={icon}
                title={title}
                count={courses.length}
                badgeColor={badgeColor}
                textColor={textColor}
            />

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <div key={course.id} className="relative">
                        <CoursePreviewCard course={course} />

                        <div className="absolute top-3 right-3">
                            <div
                                className={`px-2 py-1 ${statusBadgeColor} text-white text-xs font-medium rounded-full flex items-center gap-1`}
                            >
                                {statusIcon}
                                {statusText}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourseSection;
