import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Flex, Group, Input, Modal, Radio, Text, Textarea, ThemeIcon } from "@mantine/core";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { nanoid } from "nanoid";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { ExamQuestion } from "@/types/api";

// Form validation schema
const questionFormSchema = z.object({
    content: z.string().min(1, "Câu hỏi không được để trống"),
    options: z
        .array(
            z.object({
                id: z.string(),
                content: z.string().min(1, "Đáp án không được để trống"),
            })
        )
        .min(2, "Cần ít nhất 2 đáp án")
        .max(6, "Tối đa 6 đáp án"),
    correctAnswer: z.string().min(1, "Vui lòng chọn đáp án đúng"),
});

type QuestionFormData = z.infer<typeof questionFormSchema>;

type ModalQuestionProps = {
    opened: boolean;
    onClose: () => void;
    onSave: (data: QuestionFormData) => void;
    editQuestion?: ExamQuestion | null;
    mode?: "add" | "edit";
};

const ModalQuestion = ({
    opened,
    onClose,
    onSave,
    editQuestion,
    mode = "add",
}: ModalQuestionProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<QuestionFormData>({
        resolver: zodResolver(questionFormSchema),
        defaultValues: {
            content: "",
            options: [
                { id: nanoid(), content: "" },
                { id: nanoid(), content: "" },
                { id: nanoid(), content: "" },
                { id: nanoid(), content: "" },
            ],
            correctAnswer: "",
        },
    });

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = form;
    const { fields, append, remove } = useFieldArray({
        control,
        name: "options",
    });

    const watchedOptions = watch("options");

    // Reset form when editQuestion changes
    useEffect(() => {
        if (editQuestion && mode === "edit") {
            form.reset({
                content: editQuestion.content,
                options: editQuestion.options,
                correctAnswer: editQuestion.answer,
            });
        } else if (mode === "add") {
            form.reset({
                content: "",
                options: [
                    { id: nanoid(), content: "" },
                    { id: nanoid(), content: "" },
                    { id: nanoid(), content: "" },
                    { id: nanoid(), content: "" },
                ],
                correctAnswer: "",
            });
        }
    }, [editQuestion, mode, form]);

    const handleAddOption = () => {
        if (fields.length < 6) {
            append({ id: nanoid(), content: "" });
        }
    };

    const handleRemoveOption = (index: number) => {
        if (fields.length > 2) {
            // Reset correct answer if the removed option was selected
            const currentCorrectAnswer = watch("correctAnswer");
            const optionToRemove = watchedOptions[index];

            if (currentCorrectAnswer === optionToRemove?.id) {
                form.setValue("correctAnswer", "");
            }

            remove(index);
        }
    };

    const onSubmit = async (data: QuestionFormData) => {
        try {
            setIsSubmitting(true);

            await onSave(data);

            reset();

            onClose();
        } catch (error) {
            console.error("Error saving question:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        reset();

        onClose();
    };

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title={mode === "edit" ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi"}
            centered
            size="lg"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                <Textarea
                    label="Câu hỏi"
                    placeholder="Nhập nội dung câu hỏi"
                    autosize
                    minRows={3}
                    maxRows={10}
                    error={errors.content?.message}
                    {...form.register("content")}
                />

                <div>
                    <Text size="sm" fw={500} mb="xs">
                        Các đáp án (chọn đáp án đúng) <span className="text-red-500">*</span>
                    </Text>

                    <Radio.Group
                        value={watch("correctAnswer")}
                        onChange={(value) => form.setValue("correctAnswer", value)}
                        error={errors.correctAnswer?.message}
                    >
                        <Flex direction="column" gap="xs">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex items-center gap-x-2 w-full">
                                    <Radio value={watchedOptions[index]?.id} />

                                    <Input
                                        placeholder={`Đáp án ${index + 1}`}
                                        className="flex-1"
                                        error={errors.options?.[index]?.content?.message}
                                        {...form.register(`options.${index}.content`)}
                                    />

                                    {fields.length > 2 && (
                                        <ThemeIcon
                                            variant="light"
                                            color="red"
                                            size="sm"
                                            className="cursor-pointer"
                                            onClick={() => handleRemoveOption(index)}
                                        >
                                            <IconMinus size={14} />
                                        </ThemeIcon>
                                    )}
                                </div>
                            ))}
                        </Flex>
                    </Radio.Group>

                    {fields.length < 6 && (
                        <Button
                            variant="light"
                            size="xs"
                            leftSection={<IconPlus size={14} />}
                            onClick={handleAddOption}
                            className="mt-2"
                        >
                            Thêm đáp án
                        </Button>
                    )}
                </div>

                <Group justify="flex-end" mt="md">
                    <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
                        Hủy
                    </Button>
                    <Button type="submit" loading={isSubmitting}>
                        {mode === "edit" ? "Cập nhật câu hỏi" : "Lưu câu hỏi"}
                    </Button>
                </Group>
            </form>
        </Modal>
    );
};

export default ModalQuestion;
