import { IconClipboardCheck, IconPlaylist, IconVideo } from "@tabler/icons-react";

import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";
import { CoursePreview } from "@/types/api";

import CourseContentCard from "../../components/preview/course-content-card";
import CoursePreviewHero from "../../components/preview/course-preview-hero";
import CourseStats from "../../components/preview/course-stats";
import { LessonList } from "../../components/preview/lession-list";

interface AtldPreviewContainerProps {
    course: CoursePreview;
    isJoined: boolean;
    isLoadingJoiabled: boolean;
    isCompleted?: boolean;
    type: "atld" | "hoc-nghe";
}

const CoursePreviewContainer = ({
    course,
    isJoined,
    isLoadingJoiabled,
    isCompleted,
    type,
}: AtldPreviewContainerProps) => {
    const { t } = useI18nTranslate();

    const totlaLessons = course.theory.videos.length + course.practice.videos.length;

    const totalQuestions = course.totalQuestionOfExam || 0;

    const isValidCourse =
        course?.practice?.videos?.length > 0 ||
        course?.theory?.videos?.length > 0 ||
        course?.totalQuestionOfExam > 0;

    return (
        <div className="h-[calc(100vh-70px)] bg-white">
            <CoursePreviewHero
                type={type}
                isJoined={isJoined}
                title={course.title}
                isCompleted={isCompleted}
                isValidCourse={isValidCourse}
                description={course.description}
                isLoadingJoiabled={isLoadingJoiabled}
            >
                <CourseStats totalLessons={totlaLessons} totalQuestions={totalQuestions} />
            </CoursePreviewHero>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl py-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2 tracking-tight">
                        {t("noi_dung_khoa_hoc")}
                    </h2>
                    <p className="text-sm text-gray-600">
                        {t("hoan_thanh_tat_ca_cac_phan_de_nhan_chung_chi")}
                    </p>
                </div>

                <div className="space-y-4">
                    {/* Theory Card */}
                    <CourseContentCard
                        icon={<IconPlaylist className="h-6 w-6" strokeWidth={1.5} />}
                        title={t("1_hoc_ly_thuyet")}
                        description={t("xem_cac_video_ly_thuyet_de_hieu_ro_ve_an_toan_lao_")}
                        step="01"
                    >
                        <LessonList lessons={course.theory.videos} />
                    </CourseContentCard>

                    {/* Practice Card */}
                    <CourseContentCard
                        icon={<IconVideo className="h-6 w-6" strokeWidth={1.5} />}
                        title={t("2_hoc_thuc_hanh")}
                        description={t("xem_cac_video_thuc_hanh_de_hieu_ro_ve_an_toan_lao_")}
                        step="02"
                    >
                        <LessonList lessons={course.practice.videos} />
                    </CourseContentCard>

                    {/* Quiz Card */}
                    <CourseContentCard
                        icon={<IconClipboardCheck className="h-6 w-6" strokeWidth={1.5} />}
                        title={t("3_kiem_tra")}
                        description={t("hoan_thanh_bai_kiem_tra_de_danh_gia_kien_thuc_da_h")}
                        step="03"
                    >
                        <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 inline-block">
                            <p className="text-sm text-gray-700 font-medium">
                                {t("count_cau_hoi_trac_nghiem", {
                                    total: course.totalQuestionOfExam,
                                })}
                            </p>
                        </div>
                    </CourseContentCard>
                </div>
            </div>
        </div>
    );
};

export default CoursePreviewContainer;
