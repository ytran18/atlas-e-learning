import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Flex, Group, Input, Modal, Radio, Text, Textarea, ThemeIcon } from "@mantine/core";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { nanoid } from "nanoid";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";
import { ExamQuestion } from "@/types/api";

type QuestionFormData = {
    content: string;
    options: { id: string; content: string }[];
    correctAnswer: string;
};

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
    const { t } = useI18nTranslate();

    // Form validation schema
    const questionFormSchema = z.object({
        content: z.string().min(1, t("cau_hoi_khong_duoc_de_trong")),
        options: z
            .array(
                z.object({
                    id: z.string(),
                    content: z.string().min(1, t("dap_an_khong_duoc_de_trong")),
                })
            )
            .min(2, t("can_it_nhat_2_dap_an"))
            .max(6, t("toi_da_6_dap_an")),
        correctAnswer: z.string().min(1, t("vui_long_chon_dap_an_dung")),
    });

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
            title={mode === "edit" ? t("chinh_sua_cau_hoi") : t("them_cau_hoi")}
            centered
            size="lg"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                <Textarea
                    label={t("cau_hoi")}
                    placeholder={t("nhap_noi_dung_cau_hoi")}
                    autosize
                    minRows={3}
                    maxRows={10}
                    error={errors.content?.message}
                    {...form.register("content")}
                />

                <div>
                    <Text size="sm" fw={500} mb="xs">
                        {t("cac_dap_an_chon_dap_an_dung")} <span className="text-red-500">*</span>
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
                                        placeholder={`${t("dap_an")} ${index + 1}`}
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
                            {t("them_dap_an")}
                        </Button>
                    )}
                </div>

                <Group justify="flex-end" mt="md">
                    <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
                        {t("huy")}
                    </Button>
                    <Button type="submit" loading={isSubmitting}>
                        {mode === "edit" ? t("cap_nhat_cau_hoi") : t("luu_cau_hoi")}
                    </Button>
                </Group>
            </form>
        </Modal>
    );
};

export default ModalQuestion;
