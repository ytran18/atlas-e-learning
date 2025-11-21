import { IconShieldCheck } from "@tabler/icons-react";

import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";

export const PrivacyNotice = () => {
    const { t } = useI18nTranslate();

    return (
        <div className="mt-3 sm:mt-6 text-center">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 bg-gray-50 rounded-full px-3 py-1.5 sm:px-4 sm:py-2">
                <IconShieldCheck className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
                <span className="text-[10px] sm:text-xs">
                    {t("anh_cua_ban_duoc_ma_hoa_va_bao_mat_tuyet_doi")}
                </span>
            </div>
        </div>
    );
};
