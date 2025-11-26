import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Modal, ModalProps, TextInput, Textarea } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { useCreateDoc } from "@/api/docs/useCreateDoc";
import { documentKeys } from "@/api/docs/useGetDocsList";
import { useUpdateDoc } from "@/api/docs/useUpdateDoc";
import { DocumentResponse, DocumentType } from "@/types/documents";

type ModalCreateFileDocProps = ModalProps & {
    isEditMode: boolean;
    fileData?: DocumentResponse;
    type?: DocumentType;
};

const schema = z.object({
    title: z.string().min(1, "Vui lòng nhập tiêu đề"),
    description: z.string().min(1, "Vui lòng nhập mô tả"),
    url: z.string().min(1, "Vui lòng nhập url"),
});

type FormValues = z.infer<typeof schema>;

const ModalCreateFileDoc = ({
    opened,
    onClose,
    isEditMode,
    fileData,
    type = "file",
    ...props
}: ModalCreateFileDocProps) => {
    const queryClient = useQueryClient();

    const { mutate: createDoc, isPending: isCreating } = useCreateDoc();
    const { mutate: updateDoc, isPending: isUpdating } = useUpdateDoc();

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isValid },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: "",
            description: "",
            url: "",
        },
    });

    useEffect(() => {
        if (isEditMode && fileData) {
            setValue("title", fileData.title);
            setValue("description", fileData.description);
            setValue("url", fileData.url);
        } else {
            reset({
                title: "",
                description: "",
                url: "",
            });
        }
    }, [isEditMode, fileData, setValue, reset]);

    const typeName = type === "file" ? "tài liệu" : "video";

    const handleClose = () => {
        reset();
        onClose();
    };

    const onSubmit = (data: FormValues) => {
        const docType = type;

        if (isEditMode && fileData) {
            updateDoc(
                {
                    id: fileData.id,
                    payload: {
                        ...data,
                        type: docType,
                        sortNo: fileData.sortNo,
                    },
                },
                {
                    onSuccess: async () => {
                        await queryClient.invalidateQueries({
                            queryKey: documentKeys.list(docType),
                        });

                        notifications.show({
                            title: "Thành công",
                            message: `Cập nhật ${typeName} thành công`,
                            color: "green",
                        });

                        handleClose();
                    },
                    onError: () => {
                        notifications.show({
                            title: "Thất bại",
                            message: `Cập nhật ${typeName} thất bại`,
                            color: "red",
                        });
                    },
                }
            );
        } else {
            createDoc(
                {
                    ...data,
                    type: docType,
                },
                {
                    onSuccess: async () => {
                        await queryClient.invalidateQueries({
                            queryKey: documentKeys.list(docType),
                        });

                        notifications.show({
                            title: "Thành công",
                            message: `Thêm ${typeName} thành công`,
                            color: "green",
                        });

                        handleClose();
                    },
                    onError: () => {
                        notifications.show({
                            title: "Thất bại",
                            message: `Thêm ${typeName} thất bại`,
                            color: "red",
                        });
                    },
                }
            );
        }
    };

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            centered
            size="lg"
            title={isEditMode ? `Sửa ${typeName}` : `Thêm ${typeName}`}
            {...props}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-y-4">
                <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                        <TextInput
                            label={`Tiêu đề ${typeName}`}
                            placeholder="Nhập tiêu đề"
                            error={errors.title?.message}
                            {...field}
                        />
                    )}
                />

                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <Textarea
                            label={`Mô tả ${typeName}`}
                            placeholder="Nhập mô tả"
                            error={errors.description?.message}
                            minRows={3}
                            {...field}
                        />
                    )}
                />

                <Controller
                    name="url"
                    control={control}
                    render={({ field }) => (
                        <Textarea
                            label={`Url của ${typeName} (url public của google drive)`}
                            placeholder="Nhập url"
                            error={errors.url?.message}
                            minRows={2}
                            {...field}
                        />
                    )}
                />

                <div className="flex justify-end mt-4">
                    <Button type="submit" disabled={!isValid} loading={isCreating || isUpdating}>
                        {isEditMode ? "Lưu thay đổi" : "Thêm mới"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default ModalCreateFileDoc;
