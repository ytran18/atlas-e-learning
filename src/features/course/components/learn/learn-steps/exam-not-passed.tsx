import { useClerk } from "@clerk/nextjs";
import { Button } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";

import { courseProgressKeys } from "@/api";
import { useRetakeCourseExam } from "@/api/user/useRetakeCourseExam";
import { useLearnContext } from "@/contexts/LearnContext";
import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";

const ExamNotPassed = () => {
    const { t } = useI18nTranslate();

    const queryClient = useQueryClient();

    const { user } = useClerk();

    const { learnDetail } = useLearnContext();

    const { mutateAsync } = useRetakeCourseExam();

    const handleRetakeExam = async () => {
        if (!user?.id || !learnDetail?.id) return;
        try {
            await mutateAsync({
                userId: user?.id,
                groupId: learnDetail?.id,
            });

            queryClient.invalidateQueries({
                queryKey: courseProgressKeys.progress(learnDetail?.type, learnDetail.id),
            });
        } catch (error) {
            console.log({ error });
            return undefined;
        }
    };

    return (
        <div className="w-full h-full">
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <div className="text-6xl mb-4">🚧</div>

                <h2 className="text-2xl font-bold text-red-400 mb-2">
                    {t("ban_chua_vuot_qua_bai_kiem_tra")}
                </h2>

                <p className="text-gray-600 mb-4">{t("vui_long_lam_lai_bai_kiem_tra")}</p>

                <Button onClick={handleRetakeExam}>{t("lam_lai_bai_kiem_tra")}</Button>
            </div>
        </div>
    );
};

export default ExamNotPassed;
