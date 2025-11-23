import Link from "next/link";

import { Button } from "@mantine/core";

import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";
import { navigationPaths } from "@/utils/navigationPaths";

const CompletedContent = () => {
    const { t } = useI18nTranslate();

    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">
                {t("chuc_mung_ban_da_hoan_thanh_khoa_hoc")}
            </h2>
            <p className="text-gray-600 mb-4">
                {t("ban_da_hoan_thanh_tat_ca_cac_phan_cua_khoa_hoc_nay")}
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md">
                <p className="text-sm text-green-800">
                    {t("cam_on_ban_da_hoan_thanh_khoa_hoc_va_cho_duoc_cap_")}
                </p>
            </div>

            <Link href={navigationPaths.ATLD}>
                <Button className="mt-4">{t("quay_ve_trang_chu")}</Button>
            </Link>
        </div>
    );
};

export default CompletedContent;
