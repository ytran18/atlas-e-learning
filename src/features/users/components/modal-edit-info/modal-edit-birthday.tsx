import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Group, Input, InputLabel, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCalendar } from "@tabler/icons-react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

import { useUpdateUserInfo } from "@/api/user/useUpdateUserInfo";
import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";

type ModalEditBirthdayProps = {
    user: Record<string, any>;
    onClose: () => void;
};

const ModalEditBirthday = ({ user, onClose }: ModalEditBirthdayProps) => {
    const { t } = useI18nTranslate();

    const { mutate: updateUserInfo, isPending } = useUpdateUserInfo();

    // Parse existing birthDate from YYYY-MM-DD format to DD/MM/YYYY string
    const existingBirthDate = user?.birthDate
        ? (() => {
              const date = new Date(user.birthDate);
              const dd = String(date.getDate()).padStart(2, "0");
              const mm = String(date.getMonth() + 1).padStart(2, "0");
              const yyyy = date.getFullYear();
              return `${dd}/${mm}/${yyyy}`;
          })()
        : "";

    const birthdayForm = useForm({
        mode: "onChange",
        defaultValues: {
            birthDate: existingBirthDate,
        },
        resolver: zodResolver(
            z.object({
                birthDate: z
                    .string()
                    .min(1, t("vui_long_nhap_ngay_sinh"))
                    .regex(/^\d{2}\/\d{2}\/\d{4}$/, t("dinh_dang_ngay_sinh_khong_hop_le_ddmmyyyy"))
                    .refine(
                        (value) => {
                            const [day, month, year] = value.split("/").map(Number);
                            const date = new Date(year, month - 1, day);
                            return (
                                date.getFullYear() === year &&
                                date.getMonth() === month - 1 &&
                                date.getDate() === day &&
                                date <= new Date()
                            );
                        },
                        {
                            message: t("ngay_sinh_khong_hop_le_hoac_lon_hon_ngay_hien_tai"),
                        }
                    ),
            })
        ),
    });

    const handleSubmit = (data: { birthDate: string }) => {
        // Parse DD/MM/YYYY to YYYY-MM-DD
        const [day, month, year] = data.birthDate.split("/");
        const birthDateString = `${year}-${month}-${day}`;

        updateUserInfo(
            {
                userId: user?.id,
                birthDate: birthDateString,
            },
            {
                onSuccess: () => {
                    notifications.show({
                        title: t("thanh_cong"),
                        message: t("cap_nhat_ngay_sinh_thanh_cong"),
                        color: "green",
                    });
                    onClose();
                },
                onError: (error) => {
                    notifications.show({
                        title: t("loi"),
                        message: error.message || t("cap_nhat_ngay_sinh_that_bai"),
                        color: "red",
                    });
                },
            }
        );
    };

    // Auto-format numeric input to DD/MM/YYYY as user types
    const formatToDDMMYYYY = (value: string) => {
        const digits = value.replace(/\D/g, "").slice(0, 8); // max 8 digits
        const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean);
        return parts.join("/");
    };

    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-2">
                <InputLabel fw={400} size="sm">
                    {t("chon_ngay_sinh")}
                </InputLabel>

                <Controller
                    name="birthDate"
                    control={birthdayForm.control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            placeholder="DD/MM/YYYY"
                            onChange={(e) => {
                                const formatted = formatToDDMMYYYY(e.currentTarget.value);
                                field.onChange(formatted);
                            }}
                            inputMode="numeric"
                            leftSection={<IconCalendar size={18} stroke={1.5} />}
                            maxLength={10}
                            error={!!birthdayForm.formState.errors.birthDate}
                        />
                    )}
                />

                {birthdayForm.formState.errors.birthDate?.message && (
                    <Text size="xs" c="red">
                        {birthdayForm.formState.errors.birthDate?.message as string}
                    </Text>
                )}
            </div>

            <Group gap="sm" justify="flex-end">
                <Button size="xs" variant="outline" onClick={onClose} disabled={isPending}>
                    {t("huy_1")}
                </Button>

                <Button
                    disabled={!birthdayForm.formState.isValid || isPending}
                    size="xs"
                    onClick={birthdayForm.handleSubmit(handleSubmit)}
                    type="submit"
                    loading={isPending}
                >
                    {t("luu")}
                </Button>
            </Group>
        </div>
    );
};

export default ModalEditBirthday;
