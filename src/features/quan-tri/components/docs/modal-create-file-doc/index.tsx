import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Modal, ModalProps, TextInput, Textarea } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconBook, IconShield } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { useCreateDoc } from "@/api/docs/useCreateDoc";
import { documentKeys } from "@/api/docs/useGetDocsList";
import { useUpdateDoc } from "@/api/docs/useUpdateDoc";
import { DocumentCategory, DocumentResponse, DocumentType } from "@/types/documents";

type ModalCreateFileDocProps = ModalProps & {
    isEditMode: boolean;
    fileData?: DocumentResponse;
    type?: DocumentType;
    category?: DocumentCategory;
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
    category,
    ...props
}: ModalCreateFileDocProps) => {
    const queryClient = useQueryClient();

    const initialStep = category || fileData?.category ? "form" : "category";

    const [step, setStep] = useState<"category" | "form">(initialStep);

    const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | undefined>(
        category || fileData?.category
    );

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
        if (opened) {
            const hasCategory = category || fileData?.category;

            if (hasCategory) {
                setStep("form");
                setSelectedCategory(hasCategory);
            } else {
                setStep("category");
                setSelectedCategory(undefined);
            }
        }
    }, [opened, category, fileData?.category]);

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
        setStep("category");
        setSelectedCategory(undefined);
        onClose();
    };

    const onSubmit = (data: FormValues) => {
        const docType = type;
        const docCategory = selectedCategory || fileData?.category;

        if (!docCategory) {
            notifications.show({
                title: "Lỗi",
                message: "Vui lòng chọn loại tài liệu",
                color: "red",
            });
            return;
        }

        if (isEditMode && fileData) {
            updateDoc(
                {
                    id: fileData.id,
                    payload: {
                        ...data,
                        type: docType,
                        category: docCategory,
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
                    category: docCategory,
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

    const handleCategorySelect = (categoryType: DocumentCategory) => {
        setSelectedCategory(categoryType);
        setStep("form");
    };

    const handleBackToCategory = () => {
        setStep("category");
    };

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            centered
            size="lg"
            title={
                step === "category"
                    ? "Chọn loại tài liệu"
                    : isEditMode
                      ? `Sửa ${typeName}`
                      : `Thêm ${typeName}`
            }
            {...props}
        >
            {step === "category" ? (
                <div className="w-full flex flex-col gap-y-4">
                    <p className="text-gray-600 mb-2">
                        Vui lòng chọn phân loại để cấu hình thông tin phù hợp.
                    </p>

                    <button
                        onClick={() => handleCategorySelect("atld")}
                        className="w-full flex items-start gap-4 p-6 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group"
                    >
                        <div className="shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <IconShield className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1 text-left">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                An Toàn Lao Động
                            </h3>
                            <p className="text-sm text-gray-600">
                                Dành cho 6 nhóm huấn luyện an toàn về sinh lao động.
                            </p>
                        </div>
                    </button>

                    <button
                        onClick={() => handleCategorySelect("hoc-nghe")}
                        className="w-full flex items-start gap-4 p-6 border-2 border-gray-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all cursor-pointer group"
                    >
                        <div className="shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                            <IconBook className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-1 text-left">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Học Nghề</h3>
                            <p className="text-sm text-gray-600">
                                Dành cho các tài liệu đào tạo nghề nghiệp và kỹ năng.
                            </p>
                        </div>
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-y-4">
                    {selectedCategory && (
                        <div className="flex items-center gap-2 mb-2 p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">Loại tài liệu:</span>
                            <span className="text-sm font-semibold text-gray-900">
                                {selectedCategory === "atld" ? "An Toàn Lao Động" : "Học Nghề"}
                            </span>
                            <Button
                                variant="subtle"
                                size="xs"
                                onClick={handleBackToCategory}
                                className="ml-auto"
                            >
                                Thay đổi
                            </Button>
                        </div>
                    )}

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
                                label={`Url của ${typeName} (url public của ${type === "file" ? "google drive" : "youtube"})`}
                                placeholder="Nhập url"
                                error={errors.url?.message}
                                minRows={2}
                                {...field}
                            />
                        )}
                    />

                    <div className="flex justify-end mt-4">
                        <Button
                            type="submit"
                            disabled={!isValid}
                            loading={isCreating || isUpdating}
                        >
                            {isEditMode ? "Lưu thay đổi" : "Thêm mới"}
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    );
};

export default ModalCreateFileDoc;
