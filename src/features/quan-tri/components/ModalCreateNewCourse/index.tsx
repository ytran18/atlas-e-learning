import { FunctionComponent } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Modal } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { courseListKeys, useCreateCourse } from "@/api";
import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";
import { CourseType, CreateCourseRequest } from "@/types/api";

type ModalCreateNewCourseProps = {
    opened: boolean;
    title: string;
    type: CourseType;
    onClose: () => void;
};

const ModalCreateNewCourse: FunctionComponent<ModalCreateNewCourseProps> = ({
    opened,
    title,
    onClose,
    type,
}) => {
    const { t } = useI18nTranslate();

    // Zod schema cho form validation
    const createCourseSchema = z.object({
        title: z
            .string()
            .min(1, t("tieu_de_khoa_hoc_la_bat_buoc"))
            .min(3, t("tieu_de_phai_co_it_nhat_3_ky_tu")),
        description: z
            .string()
            .min(1, t("mo_ta_khoa_hoc_la_bat_buoc"))
            .min(10, t("mo_ta_phai_co_it_nhat_10_ky_tu")),
    });

    // Form data type chỉ chứa title và description
    type CreateCourseFormData = z.infer<typeof createCourseSchema>;

    const queryClient = useQueryClient();

    const { mutate: createCourseMutation, isPending } = useCreateCourse(type, {
        onSuccess: async () => {
            form.reset();

            onClose();

            await queryClient.invalidateQueries({
                queryKey: courseListKeys.list(type),
            });
        },
    });

    const form = useForm<CreateCourseFormData>({
        resolver: zodResolver(createCourseSchema),
        mode: "onChange",
        defaultValues: {
            title: "",
            description: "",
        },
    });

    const onSubmit = (data: CreateCourseFormData) => {
        // Tạo CreateCourseRequest với các field khác để rỗng
        const createCourseData: CreateCourseRequest = {
            title: data.title,
            type: type,
            description: data.description,
            theory: {
                title: t("ly_thuyet"),
                description: t("phan_ly_thuyet_se_duoc_cap_nhat_sau"),
                videos: [],
            },
            practice: {
                title: t("thuc_hanh"),
                description: t("phan_thuc_hanh_se_duoc_cap_nhat_sau"),
                videos: [],
            },
            exam: {
                title: t("thi_cuoi_khoa"),
                description: t("bai_thi_se_duoc_cap_nhat_sau"),
                timeLimit: 1800, // 30 phút
                questions: [],
            },
        };

        createCourseMutation(createCourseData);
    };

    return (
        <Modal size="lg" opened={opened} onClose={onClose} title={title} centered>
            <div className="flex flex-col gap-y-4">
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-y-4">
                        <Input.Wrapper
                            label={t("tieu_de_khoa_hoc")}
                            withAsterisk
                            error={form.formState.errors.title?.message}
                        >
                            <Input
                                placeholder={t("nhap_tieu_de_khoa_hoc")}
                                {...form.register("title")}
                            />
                        </Input.Wrapper>

                        <Input.Wrapper
                            label={t("mo_ta_khoa_hoc")}
                            withAsterisk
                            error={form.formState.errors.description?.message}
                        >
                            <Input
                                placeholder={t("nhap_mo_ta_khoa_hoc")}
                                {...form.register("description")}
                            />
                        </Input.Wrapper>
                    </div>

                    <div className="flex justify-end items-center gap-x-4 mt-6">
                        <Button variant="outline" onClick={onClose} disabled={isPending}>
                            {t("huy")}
                        </Button>

                        <Button
                            type="submit"
                            loading={isPending}
                            disabled={!form.formState.isValid}
                        >
                            {t("them")}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default ModalCreateNewCourse;
