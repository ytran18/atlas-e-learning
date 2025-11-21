import { IconInfoCircle } from "@tabler/icons-react";

import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";

interface ErrorMessageProps {
    message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
    const { t } = useI18nTranslate();

    return (
        <div className="mb-3 sm:mb-6 bg-red-50 rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-red-200">
            <div className="flex items-start gap-2 sm:gap-3">
                <div className="bg-red-500 rounded-lg sm:rounded-xl p-1.5 sm:p-2.5 shrink-0">
                    <IconInfoCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>

                <div>
                    <h3 className="font-semibold text-red-900 mb-0.5 sm:mb-1 text-xs sm:text-base">
                        {t("co_loi_xay_ra")}
                    </h3>

                    <p className="text-xs sm:text-sm text-red-600">{message}</p>
                </div>
            </div>
        </div>
    );
};
