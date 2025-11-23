import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Group, Input, InputLabel, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm } from "react-hook-form";
import z from "zod";

import { useUpdateUserInfo } from "@/api/user/useUpdateUserInfo";
import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";

type ModalEditCompanyNameProps = {
    user: Record<string, any>;
    onClose: () => void;
};

const ModalEditCompanyName = ({ user, onClose }: ModalEditCompanyNameProps) => {
    const { t } = useI18nTranslate();

    const { mutate: updateUserInfo, isPending } = useUpdateUserInfo();

    const companyNameForm = useForm({
        mode: "onChange",
        defaultValues: {
            companyName: user?.companyName || "",
        },
        resolver: zodResolver(
            z.object({
                companyName: z.string().optional(),
            })
        ),
    });

    const handleSubmit = (data: { companyName?: string }) => {
        updateUserInfo(
            {
                userId: user?.id,
                companyName: data.companyName || "",
            },
            {
                onSuccess: () => {
                    notifications.show({
                        title: t("thanh_cong"),
                        message: t("cap_nhat_cong_ty_thanh_cong"),
                        color: "green",
                    });
                    onClose();
                },
                onError: (error) => {
                    notifications.show({
                        title: t("loi"),
                        message: error.message || t("cap_nhat_cong_ty_that_bai"),
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
                    {t("nhap_ten_cong_ty")}
                </InputLabel>

                <Input
                    {...companyNameForm.register("companyName")}
                    placeholder={t("vi_du_cong_ty_abc")}
                    error={companyNameForm.formState.errors.companyName?.message as string}
                />

                {companyNameForm.formState.errors.companyName?.message && (
                    <Text size="xs" c="red">
                        {companyNameForm.formState.errors.companyName?.message as string}
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
                    onClick={companyNameForm.handleSubmit(handleSubmit)}
                    type="submit"
                    loading={isPending}
                >
                    {t("luu")}
                </Button>
            </Group>
        </div>
    );
};

export default ModalEditCompanyName;
