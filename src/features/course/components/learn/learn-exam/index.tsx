import { Button, Card, Divider, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";

import { courseProgressKeys, useSubmitExam, useUpdateProgress } from "@/api/user";
import { useLearnContext } from "@/contexts/LearnContext";
import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";
import { CourseType, ExamAnswer } from "@/types/api";

import ListQuestions from "./list-questions";

interface ExamFormValues {
    [questionId: string]: string;
}

interface LearnExamProps {
    courseType: CourseType;
}

const LearnExam = ({ courseType }: LearnExamProps) => {
    const { t } = useI18nTranslate();

    const { learnDetail, progress } = useLearnContext();

    const queryClient = useQueryClient();

    const submitExam = useSubmitExam(courseType);

    const updateProgress = useUpdateProgress(courseType);

    const isFinishCourse = progress?.isCompleted;

    // Initialize form with empty values for all questions
    const form = useForm<ExamFormValues>({
        defaultValues: learnDetail.exam.questions.reduce((acc, question) => {
            acc[question.id] = "";
            return acc;
        }, {} as ExamFormValues),
        mode: "onChange",
    });

    // Watch all form values to check if all questions are answered
    const watchedValues = form.watch();

    // Check if all questions are answered
    const isAllQuestionsAnswered = learnDetail.exam.questions.every(
        (question) => watchedValues[question.id] !== ""
    );

    const handleSubmit = async (values: ExamFormValues) => {
        try {
            // Convert form values to API format
            const answers: ExamAnswer[] = learnDetail.exam.questions.map((question) => ({
                questionId: question.id,
                answer: values[question.id],
            }));

            // Submit exam answers
            const result = await submitExam.mutateAsync({
                groupId: learnDetail.id,
                answers,
            });

            // Show success notification
            notifications.show({
                title: t("nop_bai_thanh_cong"),
                message: `Điểm số: ${result.score}/${result.totalQuestions} (${result.passed ? t("dat") : t("khong_dat")})`,
                position: "top-right",
                variant: "success",
            });

            // If exam is passed, update progress to mark course as completed
            if (result.passed) {
                try {
                    await updateProgress.mutateAsync(
                        {
                            groupId: learnDetail.id,
                            section: "exam",
                            videoIndex: 0,
                            currentTime: 0,
                            isCompleted: true,
                        },
                        {
                            onSuccess: () => {
                                queryClient.invalidateQueries({
                                    queryKey: courseProgressKeys.progress(
                                        courseType,
                                        learnDetail.id
                                    ),
                                });
                            },
                        }
                    );
                } catch (progressError) {
                    console.error("Failed to update progress:", progressError);
                    // Don't show error to user as exam was already submitted successfully
                }
            }
        } catch (error) {
            console.error("Failed to submit exam:", error);
        }
    };

    return (
        <Card withBorder shadow="sm" radius="md" h="100%">
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="h-full overflow-y-auto">
                    <div className="flex flex-col gap-y-6 overflow-y-auto">
                        <div className="flex flex-col gap-y-1">
                            <Text size="xl">{learnDetail.exam.title}</Text>

                            <Text size="sm">{learnDetail.exam.description}</Text>
                        </div>

                        <ListQuestions
                            questions={learnDetail.exam.questions}
                            isFinishCourse={isFinishCourse}
                        />

                        {!isFinishCourse && (
                            <>
                                <Divider my="md" />

                                <div className="flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={!isAllQuestionsAnswered || submitExam.isPending}
                                        loading={submitExam.isPending}
                                        size="md"
                                        variant="filled"
                                    >
                                        {submitExam.isPending
                                            ? t("dang_nop_bai")
                                            : t("nop_bai_kiem_tra")}
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </form>
            </FormProvider>
        </Card>
    );
};

export default LearnExam;
