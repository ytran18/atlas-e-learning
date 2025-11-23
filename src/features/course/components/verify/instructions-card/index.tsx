import { IconInfoCircle } from "@tabler/icons-react";

import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";

export const InstructionsCard = () => {
    const { t } = useI18nTranslate();

    return (
        <div className="hidden sm:block mb-6 bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
            <div className="flex items-start gap-3">
                <div className="bg-blue-500 rounded-xl p-2.5 shrink-0">
                    <IconInfoCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-base">
                        {t("huong_dan_chup_anh")}
                    </h3>

                    <ul className="space-y-1.5 text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0" />
                            {t("dat_khuon_mat_vao_giua_khung_hinh_oval")}
                        </li>

                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0" />
                            {t("dam_bao_anh_sang_du_sang_va_khong_bi_choi")}
                        </li>

                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0" />
                            {t("nhin_thang_vao_camera_va_giu_dau_thang")}
                        </li>

                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0" />
                            {t("khong_deo_kinh_den_hoac_che_khuon_mat")}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
