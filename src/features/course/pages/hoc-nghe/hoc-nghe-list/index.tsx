"use client";

import { useClerk } from "@clerk/nextjs";

import { useGetUserProgress } from "@/api/user/useGetUserProgress";
import CourseLoading from "@/features/course/components/list/course-loading";
import CourseListHeroSection from "@/features/course/components/list/hero-section";
import CourseListSection from "@/features/course/components/list/list-section";
import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";

const HocNgheListPage = () => {
    const { user } = useClerk();

    const { t } = useI18nTranslate();

    const { data: userProgress, isLoading: isLoadingUserProgress } = useGetUserProgress(
        user?.id || "",
        "hoc-nghe"
    );

    if (!userProgress || isLoadingUserProgress) {
        return <CourseLoading />;
    }

    const hasAnyCourses =
        userProgress?.inProgress?.length > 0 ||
        userProgress?.notStarted?.length > 0 ||
        userProgress?.incomplete?.length > 0 ||
        userProgress?.completed?.length > 0;

    const totalCourses =
        userProgress?.inProgress?.length +
        userProgress?.notStarted?.length +
        userProgress?.incomplete?.length +
        userProgress?.completed?.length;

    return (
        <div className="h-[calc(100vh-70px)] bg-white">
            <CourseListHeroSection totalCourses={totalCourses} />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                {hasAnyCourses && (
                    <div className="mb-8 sm:mb-12 text-center">
                        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2 tracking-tight">
                            {t("cac_khoa_hoc_co_san")}
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600">
                            {t("chon_khoa_hoc_phu_hop_voi_nhu_cau_hoc_tap_cua_ban")}
                        </p>
                    </div>
                )}

                <CourseListSection categorizedCourses={userProgress} />
            </div>
        </div>
    );
};

export default HocNgheListPage;
