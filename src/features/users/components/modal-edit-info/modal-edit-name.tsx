import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Group, Input, InputLabel, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm } from "react-hook-form";
import z from "zod";

import { useUpdateUserInfo } from "@/api/user/useUpdateUserInfo";
import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";

type ModalEditNameProps = {
    user: Record<string, any>;
    onClose: () => void;
};

const ModalEditName = ({ user, onClose }: ModalEditNameProps) => {
    const { t } = useI18nTranslate();

    const { mutate: updateUserInfo, isPending } = useUpdateUserInfo();

    const nameForm = useForm({
        mode: "onChange",
        defaultValues: {
            fullName: user?.fullName || "",
        },
        resolver: zodResolver(
            z.object({
                fullName: z.string().min(1, t("vui_long_nhap_ho_va_ten")),
            })
        ),
    });

    const handleSubmit = (data: { fullName: string }) => {
        updateUserInfo(
            {
                userId: user?.id,
                fullName: data.fullName,
            },
            {
                onSuccess: () => {
                    notifications.show({
                        title: t("thanh_cong"),
                        message: t("cap_nhat_ho_va_ten_thanh_cong"),
                        color: "green",
                    });
                    onClose();
                },
                onError: (error) => {
                    notifications.show({
                        title: t("loi"),
                        message: error.message || t("cap_nhat_ho_va_ten_that_bai"),
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
                    {t("nhap_ho_va_ten")}
                </InputLabel>

                <Input
                    {...nameForm.register("fullName")}
                    error={nameForm.formState.errors.fullName?.message as string}
                />

                {nameForm.formState.errors.fullName?.message && (
                    <Text size="xs" c="red">
                        {nameForm.formState.errors.fullName?.message as string}
                    </Text>
                )}
            </div>

            <Group gap="sm" justify="flex-end">
                <Button size="xs" variant="outline" onClick={onClose} disabled={isPending}>
                    {t("huy_1")}
                </Button>

                <Button
                    disabled={!nameForm.formState.isValid || isPending}
                    size="xs"
                    onClick={nameForm.handleSubmit(handleSubmit)}
                    type="submit"
                    loading={isPending}
                >
                    {t("luu")}
                </Button>
            </Group>
        </div>
    );
};

export default ModalEditName;
