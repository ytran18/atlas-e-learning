import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Group, Input, InputLabel, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm } from "react-hook-form";
import z from "zod";

import { useUpdateUserInfo } from "@/api/user/useUpdateUserInfo";

type ModalEditIdCardProps = {
    user: Record<string, any>;
    onClose: () => void;
};

const ModalEditIdCard = ({ user, onClose }: ModalEditIdCardProps) => {
    const { mutate: updateUserInfo, isPending } = useUpdateUserInfo();

    const idCardForm = useForm({
        mode: "onChange",
        defaultValues: {
            idCard: user?.cccd || "",
        },
        resolver: zodResolver(
            z
                .object({
                    idCard: z.string().min(1, "Vui lòng nhập CCCD hoặc Hộ chiếu"),
                })
                .superRefine((data, ctx) => {
                    const cccdUpper = data.idCard.toUpperCase().trim();
                    const isCCCD = /^\d{12}$/u.test(data.idCard);
                    const isPassport = /^[A-Z0-9]{6,9}$/u.test(cccdUpper);

                    if (!isCCCD && !isPassport) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: "CCCD phải là 12 số hoặc Hộ chiếu phải từ 6-9 ký tự chữ và số",
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
                        title: "Thành công",
                        message: "Cập nhật CCCD/Hộ chiếu thành công.",
                        color: "green",
                    });
                    onClose();
                },
                onError: (error) => {
                    notifications.show({
                        title: "Lỗi",
                        message: error.message || "Cập nhật CCCD/Hộ chiếu thất bại",
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
                    Nhập CCCD hoặc Hộ chiếu
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
                    Hủy
                </Button>

                <Button
                    disabled={!idCardForm.formState.isValid || isPending}
                    size="xs"
                    onClick={idCardForm.handleSubmit(handleSubmit)}
                    type="submit"
                    loading={isPending}
                >
                    Lưu
                </Button>
            </Group>
        </div>
    );
};

export default ModalEditIdCard;
