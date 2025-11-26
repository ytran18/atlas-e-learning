import { Button } from "@mantine/core";
import { IconBookOff } from "@tabler/icons-react";

import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";

const CourseEmptyState = () => {
    const { t } = useI18nTranslate();

    return (
        <div className="flex flex-col items-center justify-center py-16 sm:py-20">
            <div className="bg-gray-100 rounded-full p-6 mb-6">
                <IconBookOff className="h-12 w-12 text-gray-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t("chua_co_khoa_hoc_nao")}
            </h3>
            <p className="text-gray-600 text-center max-w-md mb-6">
                {t("hien_tai_chua_co_khoa_hoc_hoc_nghe_nao_duoc_cung_c")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={() => window.location.reload()} color="green" variant="filled">
                    {t("lam_moi_trang")}
                </Button>
                <Button onClick={() => window.history.back()} variant="default">
                    {t("quay_lai")}
                </Button>
            </div>
        </div>
    );
};

export default CourseEmptyState;
