import { FunctionComponent } from "react";

import { useSearchParams } from "next/navigation";

import { useClerk } from "@clerk/nextjs";
import { Button, Card, Text, Tooltip } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconChevronRight, IconCircleCheck } from "@tabler/icons-react";
import { Image } from "antd";

import { useDeleteUserProgress } from "@/api/admin/useDeleteUserProgress";
import { DEFAULT_IMAGE_URL } from "@/constants";
import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";
import { StudentStats } from "@/types/api";

import { UserDetailTabs } from "./ModalUserDetail";

type ModalUserDetailInfoProps = {
    user: StudentStats;
    isCompleted: boolean;
    isTheoryCompleted: boolean;
    isPracticeCompleted: boolean;
    setTab: (tab: UserDetailTabs) => void;
    onClose: () => void;
    onDeleteSuccess?: () => void;
};

const ModalUserDetailInfo: FunctionComponent<ModalUserDetailInfoProps> = ({
    user,
    isCompleted,
    isTheoryCompleted,
    isPracticeCompleted,
    setTab,
    onClose,
    onDeleteSuccess,
}) => {
    const { t } = useI18nTranslate();

    const { mutate: deleteUserProgress, isPending: isDeletingUserProgress } =
        useDeleteUserProgress();

    const { user: clerkUser } = useClerk();

    const groupId = useSearchParams().get("courseId");

    const isAdmin = clerkUser?.unsafeMetadata?.role === "admin";

    const handleExamTabClick = () => {
        if (!isCompleted) return;

        setTab(UserDetailTabs.EXAM);
    };

    const renderLabel = isCompleted
        ? t("nhan_vao_de_xem_chi_tiet_bai_kiem_tra")
        : t("chua_hoan_thanh_khoa_hoc");

    const handleDeleteUserProgress = () => {
        modals.openConfirmModal({
            title: t("xac_nhan_xoa_ket_hoc_tap"),
            centered: true,
            children: (
                <Text size="xs">{t("ket_hoc_tap_se_duoc_xoa_khoi_he_thong_va_khong_the")}</Text>
            ),
            labels: { confirm: t("xoa"), cancel: t("huy") },
            onConfirm: async () => {
                deleteUserProgress(
                    { userId: user.userId, groupId: groupId as string },
                    {
                        onSuccess: async () => {
                            notifications.show({
                                title: t("thanh_cong"),
                                message: t("ket_hoc_tap_da_duoc_xoa_thanh_cong"),
                                color: "green",
                                position: "top-right",
                            });

                            // Close modal first
                            onClose();

                            // Trigger refresh callback if provided
                            if (onDeleteSuccess) {
                                // Small delay to ensure modal is closed before refresh
                                setTimeout(() => {
                                    onDeleteSuccess();
                                }, 100);
                            }
                        },
                    }
                );
            },
            confirmProps: { color: "red" },
        });
    };

    return (
        <div className="w-full flex flex-col gap-y-4">
            <div className="w-full flex items-center justify-between gap-x-2">
                <Card withBorder className="w-full py-1!">
                    <Text size="xs" fw={500} c="dimmed">
                        {t("ngay_sinh")}
                    </Text>
                    <Text size="sm" fw={500}>
                        {user.birthDate}
                    </Text>
                </Card>

                <Card withBorder className="w-full py-1!">
                    <Text size="xs" fw={500} c="dimmed">
                        {t("cong_ty")}
                    </Text>
                    <Text size="sm" fw={500}>
                        {user.companyName}
                    </Text>
                </Card>
            </div>

            <div className="w-full flex items-center justify-between gap-x-2">
                <div className="w-full flex flex-col items-start justify-between gap-y-1">
                    <Text size="xs" fw={500}>
                        {t("anh_luc_dau")}
                    </Text>

                    <Image
                        src={user.startImageUrl}
                        alt={user.fullname}
                        className="w-full max-h-[165px] object-cover"
                        fallback={DEFAULT_IMAGE_URL}
                    />
                </div>

                <div className="w-full flex flex-col items-start justify-between gap-y-1">
                    <Text size="xs" fw={500}>
                        {t("anh_luc_dang_hoc")}
                    </Text>

                    <Image
                        src={user.finishImageUrl}
                        alt={user.fullname}
                        className="w-full max-h-[165px] object-cover"
                        fallback={DEFAULT_IMAGE_URL}
                    />
                </div>
            </div>

            <Tooltip label={renderLabel} color={isCompleted ? "green" : "red"} withArrow>
                <Card
                    withBorder
                    className="w-full cursor-pointer hover:bg-gray-50!"
                    onClick={handleExamTabClick}
                >
                    <div className="flex items-center justify-between gap-x-2">
                        <Text size="sm" fw={600}>
                            {t("ket_qua_bai_kiem_tra")}
                        </Text>

                        <div className="flex items-center gap-x-3">
                            <Text size="sm" fw={600} c={user.examResult?.passed ? "green" : "red"}>
                                {!isCompleted ? (
                                    <>{t("chua_lam_bai_kiem_tra")}</>
                                ) : (
                                    <>
                                        {user.examResult?.score} / {user.examResult?.totalQuestions}{" "}
                                        ({user.examResult?.passed ? t("dat") : t("khong_dat")})
                                    </>
                                )}
                            </Text>

                            <IconChevronRight size={20} />
                        </div>
                    </div>
                </Card>
            </Tooltip>

            <div className="w-full flex items-center justify-between gap-x-2">
                <Card withBorder className="w-full">
                    <div className="flex flex-col gap-y-2">
                        <div className="flex items-center gap-x-1">
                            <IconCircleCheck
                                size={20}
                                className={isTheoryCompleted ? "text-green-500" : "text-red-500"}
                            />

                            <Text size="sm" fw={600}>
                                {t("ly_thuyet")}
                            </Text>
                        </div>

                        <Text size="sm" fw={600}>
                            {isTheoryCompleted ? t("da_hoan_thanh") : t("chua_hoan_thanh")}
                        </Text>
                    </div>
                </Card>

                <Card withBorder className="w-full">
                    <div className="flex flex-col gap-y-2">
                        <div className="flex items-center gap-x-1">
                            <IconCircleCheck
                                size={20}
                                className={isPracticeCompleted ? "text-green-500" : "text-red-500"}
                            />

                            <Text size="sm" fw={600}>
                                {t("thuc_hanh")}
                            </Text>
                        </div>

                        <Text size="sm" fw={600}>
                            {isPracticeCompleted ? t("da_hoan_thanh") : t("chua_hoan_thanh")}
                        </Text>
                    </div>
                </Card>

                <Card withBorder className="w-full">
                    <div className="flex flex-col gap-y-2">
                        <div className="flex items-center gap-x-1">
                            <IconCircleCheck
                                size={20}
                                className={isCompleted ? "text-green-500" : "text-red-500"}
                            />

                            <Text size="sm" fw={600}>
                                {t("chung_chi")}
                            </Text>
                        </div>

                        <Text size="sm" fw={600}>
                            {isCompleted ? t("da_hoan_thanh") : t("chua_hoan_thanh")}
                        </Text>
                    </div>
                </Card>
            </div>

            {isAdmin && (
                <div className="w-full flex items-center justify-end">
                    <Button
                        color="red"
                        onClick={handleDeleteUserProgress}
                        loading={isDeletingUserProgress}
                    >
                        {t("xoa_ket_hoc_tap")}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ModalUserDetailInfo;
