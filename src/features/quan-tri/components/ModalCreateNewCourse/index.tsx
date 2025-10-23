import { FunctionComponent } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Modal } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { courseListKeys, useCreateCourse } from "@/hooks/api";
import { CourseType, CreateCourseRequest } from "@/types/api";

type ModalCreateNewCourseProps = {
    opened: boolean;
    title: string;
    type: CourseType;
    onClose: () => void;
};

// Zod schema cho form validation
const createCourseSchema = z.object({
    title: z
        .string()
        .min(1, "Tiêu đề khóa học là bắt buộc")
        .min(3, "Tiêu đề phải có ít nhất 3 ký tự"),
    description: z
        .string()
        .min(1, "Mô tả khóa học là bắt buộc")
        .min(10, "Mô tả phải có ít nhất 10 ký tự"),
});

// Form data type chỉ chứa title và description
type CreateCourseFormData = z.infer<typeof createCourseSchema>;

const ModalCreateNewCourse: FunctionComponent<ModalCreateNewCourseProps> = ({
    opened,
    title,
    onClose,
    type,
}) => {
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
                title: "Lý thuyết",
                description: "Phần lý thuyết sẽ được cập nhật sau",
                videos: [],
            },
            practice: {
                title: "Thực hành",
                description: "Phần thực hành sẽ được cập nhật sau",
                videos: [],
            },
            exam: {
                title: "Thi cuối khóa",
                description: "Bài thi sẽ được cập nhật sau",
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
                            label="Tiêu đề khóa học"
                            withAsterisk
                            error={form.formState.errors.title?.message}
                        >
                            <Input
                                placeholder="Nhập tiêu đề khóa học"
                                {...form.register("title")}
                            />
                        </Input.Wrapper>

                        <Input.Wrapper
                            label="Mô tả khóa học"
                            withAsterisk
                            error={form.formState.errors.description?.message}
                        >
                            <Input
                                placeholder="Nhập mô tả khóa học"
                                {...form.register("description")}
                            />
                        </Input.Wrapper>
                    </div>

                    <div className="flex justify-end items-center gap-x-4 mt-6">
                        <Button variant="outline" onClick={onClose} disabled={isPending}>
                            Hủy
                        </Button>

                        <Button
                            type="submit"
                            loading={isPending}
                            disabled={!form.formState.isValid}
                        >
                            Thêm
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default ModalCreateNewCourse;
