import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";

const DocumentsHeroSection = () => {
    const { t } = useI18nTranslate();

    return (
        <div className="bg-linear-to-br from-blue-50 via-indigo-50 to-blue-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                <div className="max-w-5xl">
                    <h1 className="text-4xl sm:text-5xl font-semibold mb-5 text-gray-900 tracking-tight">
                        {t("thu_vien_hoc_lieu_va_thuc_hanh")}
                    </h1>

                    <p className="text-xl text-gray-700 mb-8 max-w-3xl leading-relaxed font-normal">
                        {t("mo_ta_thu_vien_hoc_lieu")}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DocumentsHeroSection;
