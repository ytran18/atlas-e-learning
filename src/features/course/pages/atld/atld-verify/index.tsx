"use client";

import PhotoCaptureContainer from "@/features/course/container/photo-capture-container";
import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";

const AtldVerifyPage = () => {
    const { t } = useI18nTranslate();

    return (
        <div className="h-[calc(100vh-60px)] sm:h-[calc(100vh-70px)] bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 py-4 sm:py-8">
            <div className="container mx-auto px-4 max-w-2xl h-full flex flex-col">
                {/* Simple Header */}
                <div className="text-center mb-4 sm:mb-6">
                    <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                        {t("chup_hinh_selfie")}
                    </h1>

                    <p className="text-xs sm:text-base text-gray-600">
                        {t("ban_can_chup_hinh_selfie_de_lam_ho_so_chung_nhan")}
                    </p>
                </div>

                <PhotoCaptureContainer
                    courseType="atld"
                    paramKey="atldId"
                    learnPath="/atld/[atldId]/learn"
                />
            </div>
        </div>
    );
};

export default AtldVerifyPage;
