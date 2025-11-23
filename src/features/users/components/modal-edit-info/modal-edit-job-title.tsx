import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Group, Input, InputLabel, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm } from "react-hook-form";
import z from "zod";

import { useUpdateUserInfo } from "@/api/user/useUpdateUserInfo";
import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";

type ModalEditJobTitleProps = {
    user: Record<string, any>;
    onClose: () => void;
};

const ModalEditJobTitle = ({ user, onClose }: ModalEditJobTitleProps) => {
    const { t } = useI18nTranslate();

    const { mutate: updateUserInfo, isPending } = useUpdateUserInfo();

    const jobTitleForm = useForm({
        mode: "onChange",
        defaultValues: {
            jobTitle: user?.jobTitle || "",
        },
        resolver: zodResolver(
            z.object({
                jobTitle: z.string().optional(),
            })
        ),
    });

    const handleSubmit = (data: { jobTitle?: string }) => {
        updateUserInfo(
            {
                userId: user?.id,
                jobTitle: data.jobTitle || "",
            },
            {
                onSuccess: () => {
                    notifications.show({
                        title: t("thanh_cong"),
                        message: t("cap_nhat_chuc_vu_thanh_cong"),
                        color: "green",
                    });
                    onClose();
                },
                onError: (error) => {
                    notifications.show({
                        title: t("loi"),
                        message: error.message || t("cap_nhat_chuc_vu_that_bai"),
                        color: "red",
                    });
                },
            }
        );
    };

    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-2">
                <InputLabel fw={400} size="sm">
                    {t("nhap_chuc_vu")}
                </InputLabel>

                <Input
                    {...jobTitleForm.register("jobTitle")}
                    placeholder={t("vi_du_giam_doc_nhan_vien")}
                    error={jobTitleForm.formState.errors.jobTitle?.message as string}
                />

                {jobTitleForm.formState.errors.jobTitle?.message && (
                    <Text size="xs" c="red">
                        {jobTitleForm.formState.errors.jobTitle?.message as string}
                    </Text>
                )}
            </div>

            <Group gap="sm" justify="flex-end">
                <Button size="xs" variant="outline" onClick={onClose} disabled={isPending}>
                    {t("huy_1")}
                </Button>

                <Button
                    disabled={isPending}
                    size="xs"
                    onClick={jobTitleForm.handleSubmit(handleSubmit)}
                    type="submit"
                    loading={isPending}
                >
                    {t("luu")}
                </Button>
            </Group>
        </div>
    );
};

export default ModalEditJobTitle;
