import { IconBook, IconCertificate } from "@tabler/icons-react";

import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";

interface CourseListHeroSectionProps {
    totalCourses?: number;
}

const CourseListHeroSection = ({ totalCourses }: CourseListHeroSectionProps) => {
    const { t } = useI18nTranslate();

    return (
        <div className="bg-linear-to-br from-blue-50 via-indigo-50 to-blue-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                <div className="max-w-5xl">
                    <h1 className="text-4xl sm:text-5xl font-semibold mb-5 text-gray-900 tracking-tight">
                        {t("khoa_hoc_an_toan_lao_dong")}
                    </h1>

                    <p className="text-xl text-gray-700 mb-8 max-w-3xl leading-relaxed font-normal">
                        {t("hoc_tap_cac_ky_nang_thiet_yeu_va_nhan_chung_chi_an")}
                    </p>

                    <div className="flex flex-wrap gap-8 text-base text-gray-600">
                        {totalCourses !== 0 && (
                            <div className="flex items-center gap-2.5">
                                <IconBook className="h-5 w-5 text-blue-600" strokeWidth={1.5} />

                                <span className="font-medium">
                                    {t("tong_so_nhom_dao_tao", {
                                        totalCourses,
                                    })}
                                </span>
                            </div>
                        )}
                        <div className="flex items-center gap-2.5">
                            <IconCertificate className="h-5 w-5 text-blue-600" strokeWidth={1.5} />
                            <span className="font-medium">{t("chung_chi_cong_nhan")}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseListHeroSection;
