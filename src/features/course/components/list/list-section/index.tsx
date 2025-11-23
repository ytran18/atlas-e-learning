import { IconBook, IconCheck, IconClock, IconPlayerPlay } from "@tabler/icons-react";

import { CategorizedCourses } from "@/features/course/hooks/useCourseCategorization";
import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";

import CourseEmptyState from "../course-empty-state";
import CourseSection from "../course-section";

type CourseListSectionProps = {
    categorizedCourses: CategorizedCourses;
};

const CourseListSection = ({ categorizedCourses }: CourseListSectionProps) => {
    const { t } = useI18nTranslate();

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
            <CourseSection
                icon={<IconPlayerPlay className="w-6 h-6 text-blue-600" strokeWidth={1.5} />}
                title={t("dang_hoc")}
                courses={categorizedCourses.inProgress}
                badgeColor="bg-blue-100"
                textColor="text-blue-700"
                statusBadgeColor="bg-blue-600"
                statusIcon={<IconPlayerPlay className="w-3 h-3" strokeWidth={2} />}
                statusText={t("dang_hoc")}
            />

            {/* Chưa hoàn thành */}
            <CourseSection
                icon={<IconClock className="w-6 h-6 text-orange-600" strokeWidth={1.5} />}
                title={t("chua_hoan_thanh")}
                courses={categorizedCourses.incomplete}
                badgeColor="bg-orange-100"
                textColor="text-orange-700"
                statusBadgeColor="bg-orange-600"
                statusIcon={<IconClock className="w-3 h-3" strokeWidth={2} />}
                statusText={t("chua_hoan_thanh")}
            />

            {/* Hoàn thành */}
            <CourseSection
                icon={<IconCheck className="w-6 h-6 text-green-600" strokeWidth={1.5} />}
                title={t("hoan_thanh")}
                courses={categorizedCourses.completed}
                badgeColor="bg-green-100"
                textColor="text-green-700"
                statusBadgeColor="bg-green-600"
                statusIcon={<IconCheck className="w-3 h-3" strokeWidth={2} />}
                statusText={t("hoan_thanh")}
            />

            {/* Chưa học */}
            <CourseSection
                icon={<IconBook className="w-6 h-6 text-gray-600" strokeWidth={1.5} />}
                title={t("chua_hoc")}
                courses={categorizedCourses.notStarted}
                badgeColor="bg-gray-100"
                textColor="text-gray-700"
                statusBadgeColor="bg-gray-600"
                statusIcon={<IconBook className="w-3 h-3" strokeWidth={2} />}
                statusText={t("chua_hoc")}
            />
        </>
    );
};

export default CourseListSection;
