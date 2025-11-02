import { IconBook, IconCheck, IconClock, IconPlayerPlay } from "@tabler/icons-react";

import { CategorizedCourses } from "../../hooks/useCourseCategorization";
import CourseEmptyState from "./CourseEmptyState";
import CourseSection from "./CourseSection";

interface CourseListContainerProps {
    categorizedCourses: CategorizedCourses;
}

const CourseListContainer = ({ categorizedCourses }: CourseListContainerProps) => {
    const hasAnyCourses =
        categorizedCourses.inProgress.length > 0 ||
        categorizedCourses.incomplete.length > 0 ||
        categorizedCourses.completed.length > 0 ||
        categorizedCourses.notStarted.length > 0;

    if (!hasAnyCourses) {
        return <CourseEmptyState />;
    }

    return (
        <>
            {/* Đang học - Priority section */}
            <CourseSection
                icon={<IconPlayerPlay className="w-6 h-6 text-green-600" strokeWidth={1.5} />}
                title="Đang học"
                courses={categorizedCourses.inProgress}
                badgeColor="bg-green-100"
                textColor="text-green-700"
                statusBadgeColor="bg-green-600"
                statusIcon={<IconPlayerPlay className="w-3 h-3" strokeWidth={2} />}
                statusText="Đang học"
            />

            {/* Chưa hoàn thành */}
            <CourseSection
                icon={<IconClock className="w-6 h-6 text-orange-600" strokeWidth={1.5} />}
                title="Chưa hoàn thành"
                courses={categorizedCourses.incomplete}
                badgeColor="bg-orange-100"
                textColor="text-orange-700"
                statusBadgeColor="bg-orange-600"
                statusIcon={<IconClock className="w-3 h-3" strokeWidth={2} />}
                statusText="Chưa hoàn thành"
            />

            {/* Hoàn thành */}
            <CourseSection
                icon={<IconCheck className="w-6 h-6 text-blue-600" strokeWidth={1.5} />}
                title="Hoàn thành"
                courses={categorizedCourses.completed}
                badgeColor="bg-blue-100"
                textColor="text-blue-700"
                statusBadgeColor="bg-blue-600"
                statusIcon={<IconCheck className="w-3 h-3" strokeWidth={2} />}
                statusText="Hoàn thành"
            />

            {/* Chưa học */}
            <CourseSection
                icon={<IconBook className="w-6 h-6 text-gray-600" strokeWidth={1.5} />}
                title="Chưa học"
                courses={categorizedCourses.notStarted}
                badgeColor="bg-gray-100"
                textColor="text-gray-700"
                statusBadgeColor="bg-gray-600"
                statusIcon={<IconBook className="w-3 h-3" strokeWidth={2} />}
                statusText="Chưa học"
            />
        </>
    );
};

export default CourseListContainer;
