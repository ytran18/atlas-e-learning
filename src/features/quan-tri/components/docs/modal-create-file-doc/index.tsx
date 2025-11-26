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
import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";
import { DocumentResponse, DocumentType } from "@/types/documents";

type ModalCreateFileDocProps = ModalProps & {
    isEditMode: boolean;
    fileData?: DocumentResponse;
    type?: DocumentType;
};

const ModalCreateFileDoc = ({
    opened,
    onClose,
    isEditMode,
    fileData,
    type = "file",
    ...props
}: ModalCreateFileDocProps) => {
    const { t } = useI18nTranslate();

    const schema = z.object({
        title: z.string().min(1, t("vui_long_nhap_tieu_de")),
        description: z.string().min(1, t("vui_long_nhap_mo_ta")),
        url: z.string().min(1, t("vui_long_nhap_url")),
    });

    type FormValues = z.infer<typeof schema>;

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

    const typeName = type === "file" ? t("tai_lieu") : t("video");

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
                            title: t("thanh_cong"),
                            message: t("cap_nhat_thanh_cong_dynamic", { name: typeName }),
                            color: "green",
                        });

                        handleClose();
                    },
                    onError: () => {
                        notifications.show({
                            title: t("that_bai"),
                            message: t("cap_nhat_that_bai_dynamic", { name: typeName }),
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
                            title: t("thanh_cong"),
                            message: t("them_thanh_cong_dynamic", { name: typeName }),
                            color: "green",
                        });

                        handleClose();
                    },
                    onError: () => {
                        notifications.show({
                            title: t("that_bai"),
                            message: t("them_that_bai_dynamic", { name: typeName }),
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
            title={isEditMode ? `${t("sua")} ${typeName}` : `${t("them")} ${typeName}`}
            {...props}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-y-4">
                <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                        <TextInput
                            label={`${t("tieu_de")} ${typeName}`}
                            placeholder={t("nhap_tieu_de")}
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
                            label={`${t("mo_ta")} ${typeName}`}
                            placeholder={t("nhap_mo_ta")}
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
                            label={t("url_cua_url_public_cua_google_drive", { name: typeName })}
                            placeholder={t("nhap_url")}
                            error={errors.url?.message}
                            minRows={2}
                            {...field}
                        />
                    )}
                />

                <div className="flex justify-end mt-4">
                    <Button type="submit" disabled={!isValid} loading={isCreating || isUpdating}>
                        {isEditMode ? t("luu_thay_doi") : t("them_moi")}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default ModalCreateFileDoc;
