import { IconShieldCheck } from "@tabler/icons-react";

import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";

export const SuccessMessage = () => {
    const { t } = useI18nTranslate();

    return (
        <div className="mb-3 sm:mb-6 bg-linear-to-r from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-green-200">
            <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-green-500 rounded-lg sm:rounded-xl p-1.5 sm:p-2.5 shrink-0">
                    <IconShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>

                <div>
                    <h3 className="font-semibold text-gray-900 mb-0.5 sm:mb-1 text-xs sm:text-base">
                        {t("anh_da_duoc_chup_thanh_cong")}
                    </h3>

                    <p className="hidden sm:block text-sm text-gray-600">
                        {t("vui_long_kiem_tra_lai_anh_neu_hai_long_bam_ldquoxa")}
                    </p>
                </div>
            </div>
        </div>
    );
};
