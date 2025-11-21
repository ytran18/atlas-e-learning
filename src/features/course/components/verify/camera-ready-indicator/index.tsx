import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";

export const CameraReadyIndicator = () => {
    const { t } = useI18nTranslate();

    return (
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 animate-fade-in">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>
            {t("camera_da_san_sang")}
        </div>
    );
};
