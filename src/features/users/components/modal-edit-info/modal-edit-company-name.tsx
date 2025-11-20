import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Group, Input, InputLabel, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm } from "react-hook-form";
import z from "zod";

import { useUpdateUserInfo } from "@/api/user/useUpdateUserInfo";

type ModalEditCompanyNameProps = {
    user: Record<string, any>;
    onClose: () => void;
};

const ModalEditCompanyName = ({ user, onClose }: ModalEditCompanyNameProps) => {
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
                        title: "Thành công",
                        message: "Cập nhật công ty thành công",
                        color: "green",
                    });
                    onClose();
                },
                onError: (error) => {
                    notifications.show({
                        title: "Lỗi",
                        message: error.message || "Cập nhật công ty thất bại",
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
                    Nhập tên công ty
                </InputLabel>

                <Input
                    {...companyNameForm.register("companyName")}
                    placeholder="Ví dụ: Công ty ABC,..."
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
                    Hủy
                </Button>

                <Button
                    disabled={isPending}
                    size="xs"
                    onClick={companyNameForm.handleSubmit(handleSubmit)}
                    type="submit"
                    loading={isPending}
                >
                    Lưu
                </Button>
            </Group>
        </div>
    );
};

export default ModalEditCompanyName;
