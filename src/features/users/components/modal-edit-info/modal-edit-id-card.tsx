import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Group, Input, InputLabel, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm } from "react-hook-form";
import z from "zod";

import { useUpdateUserInfo } from "@/api/user/useUpdateUserInfo";
import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";

type ModalEditIdCardProps = {
    user: Record<string, any>;
    onClose: () => void;
};

const ModalEditIdCard = ({ user, onClose }: ModalEditIdCardProps) => {
    const { t } = useI18nTranslate();

    const { mutate: updateUserInfo, isPending } = useUpdateUserInfo();

    const idCardForm = useForm({
        mode: "onChange",
        defaultValues: {
            idCard: user?.cccd || "",
        },
        resolver: zodResolver(
            z
                .object({
                    idCard: z.string().min(1, t("vui_long_nhap_cccd_hoac_ho_chieu")),
                })
                .superRefine((data, ctx) => {
                    const cccdUpper = data.idCard.toUpperCase().trim();
                    const isCCCD = /^\d{12}$/u.test(data.idCard);
                    const isPassport = /^[A-Z0-9]{6,9}$/u.test(cccdUpper);

                    if (!isCCCD && !isPassport) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: t("cccd_phai_la_12_so_hoac_ho_chieu_phai_tu_69_ky_tu_"),
                            path: ["idCard"],
                        });
                    }
                })
        ),
    });

    const handleSubmit = (data: { idCard: string }) => {
        updateUserInfo(
            {
                userId: user?.id,
                cccd: data.idCard,
            },
            {
                onSuccess: () => {
                    notifications.show({
                        title: t("thanh_cong"),
                        message: t("cap_nhat_cccdho_chieu_thanh_cong"),
                        color: "green",
                    });
                    onClose();
                },
                onError: (error) => {
                    notifications.show({
                        title: t("loi"),
                        message: error.message || t("cap_nhat_cccdho_chieu_that_bai"),
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
                    {t("nhap_cccd_hoac_ho_chieu")}
                </InputLabel>

                <Input
                    {...idCardForm.register("idCard")}
                    error={idCardForm.formState.errors.idCard?.message as string}
                />

                {idCardForm.formState.errors.idCard?.message && (
                    <Text size="xs" c="red">
                        {idCardForm.formState.errors.idCard?.message as string}
                    </Text>
                )}
            </div>

            <Group gap="sm" justify="flex-end">
                <Button size="xs" variant="outline" onClick={onClose} disabled={isPending}>
                    {t("huy_1")}
                </Button>

                <Button
                    disabled={!idCardForm.formState.isValid || isPending}
                    size="xs"
                    onClick={idCardForm.handleSubmit(handleSubmit)}
                    type="submit"
                    loading={isPending}
                >
                    {t("luu")}
                </Button>
            </Group>
        </div>
    );
};

export default ModalEditIdCard;
