import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Group, Input, InputLabel, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm } from "react-hook-form";
import z from "zod";

import { useUpdateUserInfo } from "@/api/user/useUpdateUserInfo";

type ModalEditNameProps = {
    user: Record<string, any>;
    onClose: () => void;
};

const ModalEditName = ({ user, onClose }: ModalEditNameProps) => {
    const { mutate: updateUserInfo, isPending } = useUpdateUserInfo();

    const nameForm = useForm({
        mode: "onChange",
        defaultValues: {
            fullName: user?.fullName || "",
        },
        resolver: zodResolver(
            z.object({
                fullName: z.string().min(1, "Vui lòng nhập họ và tên"),
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
                        title: "Thành công",
                        message: "Cập nhật họ và tên thành công",
                        color: "green",
                    });
                    onClose();
                },
                onError: (error) => {
                    notifications.show({
                        title: "Lỗi",
                        message: error.message || "Cập nhật họ và tên thất bại",
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
                    Nhập họ và tên
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
                    Hủy
                </Button>

                <Button
                    disabled={!nameForm.formState.isValid || isPending}
                    size="xs"
                    onClick={nameForm.handleSubmit(handleSubmit)}
                    type="submit"
                    loading={isPending}
                >
                    Lưu
                </Button>
            </Group>
        </div>
    );
};

export default ModalEditName;
