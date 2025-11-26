"use client";

import { Result } from "antd";

import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";

const MaintenancePage = () => {
    const { t } = useI18nTranslate();

    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <Result
                status="404"
                title={t("trang_web_dang_trong_qua_trinh_bao_tri_vui_long_qu")}
                subTitle={t("xin_loi_vi_su_bat_tien_nay")}
            />
        </div>
    );
};

export default MaintenancePage;
