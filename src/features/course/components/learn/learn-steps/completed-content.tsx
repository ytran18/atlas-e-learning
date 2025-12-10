import { useState } from "react";

import Link from "next/link";

import { useClerk } from "@clerk/nextjs";
import { Button, Modal, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Trans } from "react-i18next";

import { courseProgressKeys } from "@/api";
import { useRetakeCourse } from "@/api/user/useRetakeCourse";
import { useLearnContext } from "@/contexts/LearnContext";
import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";
import { trackRetakeCourseError } from "@/libs/mixpanel";
import { navigationPaths } from "@/utils/navigationPaths";

type CompletedContentProps = {
    completedTime: number;
};

const CompletedContent = ({ completedTime }: CompletedContentProps) => {
    const { t } = useI18nTranslate();

    const { user } = useClerk();

    const { learnDetail } = useLearnContext();

    const queryClient = useQueryClient();

    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const { mutateAsync: retakeCourse, isPending } = useRetakeCourse();

    const userName = user?.unsafeMetadata?.fullName ?? "";

    const time = dayjs(Number(completedTime)).format("HH:mm DD-MM-YYYY");

    const handleRetakeCourse = async () => {
        if (!user?.id || !learnDetail?.id) return;

        try {
            await retakeCourse({
                userId: user.id,
                groupId: learnDetail.id,
                courseType: learnDetail.type,
                courseName: learnDetail.title,
                userName: userName as string,
            });

            // Invalidate progress query to refetch
            queryClient.invalidateQueries({
                queryKey: courseProgressKeys.progress(learnDetail.type, learnDetail.id),
            });

            notifications.show({
                title: t("thanh_cong"),
                message: t("ban_da_bat_dau_hoc_lai_khoa_hoc"),
                color: "green",
            });

            setShowConfirmModal(false);
        } catch (error) {
            console.error("Error retaking course:", error);

            const errorMessage = error instanceof Error ? error.message : String(error);

            trackRetakeCourseError({
                course_type: learnDetail.type,
                course_id: learnDetail.id,
                userId: user.id,
                courseName: learnDetail.title,
                error: errorMessage,
                timestamp: Date.now(),
                userName: user?.unsafeMetadata?.fullName as string,
            });
            notifications.show({
                title: t("loi"),
                message: t("khong_the_hoc_lai_khoa_hoc_vui_long_thu_lai"),
                color: "red",
            });
        }
    };

    return (
        <>
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-green-600 mb-2">
                    <Trans
                        i18nKey="chuc_mung_ban_da_hoan_thanh_khoa_hoc"
                        values={{
                            name: userName,
                        }}
                        components={{
                            1: (
                                <span className="bg-linear-to-r from-blue-400 to-indigo-600 inline-block text-transparent bg-clip-text" />
                            ),
                        }}
                    />
                </h2>
                <div className="text-gray-600 mb-4 whitespace-pre-line">
                    <Trans
                        i18nKey="ban_da_hoan_thanh_tat_ca_cac_phan_cua_khoa_hoc_nay"
                        values={{
                            time,
                        }}
                        components={{
                            1: <Text fw={500} variant="gradient" />,
                        }}
                    />
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md">
                    <p className="text-sm text-green-800">
                        {t("cam_on_ban_da_hoan_thanh_khoa_hoc_va_cho_duoc_cap_")}
                    </p>
                </div>

                <div className="flex gap-2 mt-4">
                    <Link href={navigationPaths.ATLD}>
                        <Button>{t("quay_ve_trang_chu")}</Button>
                    </Link>

                    <Button variant="outline" onClick={() => setShowConfirmModal(true)}>
                        {t("hoc_lai_khoa_hoc")}
                    </Button>
                </div>
            </div>

            <Modal
                opened={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                title={t("xac_nhan_hoc_lai_khoa_hoc")}
                centered
            >
                <Text size="sm" mb="md">
                    {t("ban_co_chac_chan_muon_hoc_lai_khoa_hoc_nay")}
                </Text>
                <Text size="sm" c="dimmed" mb="lg">
                    {t("ket_qua_hoc_cu_cua_ban_se_duoc_luu_vao_lich_su")}
                </Text>
                <div className="flex gap-2 justify-end">
                    <Button variant="subtle" onClick={() => setShowConfirmModal(false)}>
                        {t("huy")}
                    </Button>
                    <Button onClick={handleRetakeCourse} loading={isPending}>
                        {t("xac_nhan")}
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export default CompletedContent;
