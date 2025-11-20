import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Group, Input, InputLabel, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm } from "react-hook-form";
import z from "zod";

import { useUpdateUserInfo } from "@/api/user/useUpdateUserInfo";

type ModalEditJobTitleProps = {
    user: Record<string, any>;
    onClose: () => void;
};

const ModalEditJobTitle = ({ user, onClose }: ModalEditJobTitleProps) => {
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
                        title: "Thành công",
                        message: "Cập nhật chức vụ thành công",
                        color: "green",
                    });
                    onClose();
                },
                onError: (error) => {
                    notifications.show({
                        title: "Lỗi",
                        message: error.message || "Cập nhật chức vụ thất bại",
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
                    Nhập chức vụ
                </InputLabel>

                <Input
                    {...jobTitleForm.register("jobTitle")}
                    placeholder="Ví dụ: Giám đốc, Nhân viên,..."
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
                    Hủy
                </Button>

                <Button
                    disabled={isPending}
                    size="xs"
                    onClick={jobTitleForm.handleSubmit(handleSubmit)}
                    type="submit"
                    loading={isPending}
                >
                    Lưu
                </Button>
            </Group>
        </div>
    );
};

export default ModalEditJobTitle;
