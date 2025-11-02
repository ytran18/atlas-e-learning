import { Button, Card, Divider, List, Radio, Text } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";

import { courseProgressKeys, useSubmitExam, useUpdateProgress } from "@/api/user";
import { useLearnContext } from "@/contexts/LearnContext";
import { ExamAnswer } from "@/types/api";

interface ExamFormValues {
    [questionId: string]: string;
}

const LearnExam = () => {
    const { learnDetail } = useLearnContext();

    const queryClient = useQueryClient();

    const submitExam = useSubmitExam("atld"); // Assuming ATLD type for now
    const updateProgress = useUpdateProgress("atld");

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
            alert(
                `Nộp bài thành công!\nĐiểm số: ${result.score}/${result.totalQuestions} (${result.passed ? "Đạt" : "Không đạt"})`
            );

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
                                    queryKey: courseProgressKeys.progress("atld", learnDetail.id),
                                });
                            },
                        }
                    );
                    console.log("Course progress updated - marked as completed");
                } catch (progressError) {
                    console.error("Failed to update progress:", progressError);
                    // Don't show error to user as exam was already submitted successfully
                }
            }

            // Log detailed results for debugging
            console.log("=== EXAM RESULTS ===");
            console.log("Exam Title:", learnDetail.exam.title);
            console.log("Score:", result.score);
            console.log("Total Questions:", result.totalQuestions);
            console.log("Passed:", result.passed);
            console.log("Completed At:", new Date(result.completedAt).toLocaleString());
        } catch (error) {
            console.error("Failed to submit exam:", error);
            alert("Lỗi nộp bài\nCó lỗi xảy ra khi nộp bài thi. Vui lòng thử lại.");
        }
    };

    return (
        <Card withBorder shadow="sm" radius="md" padding="xl" h="100%">
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <div className="flex flex-col gap-y-6">
                    <div className="flex flex-col gap-y-1">
                        <Text size="xl">{learnDetail.exam.title}</Text>

                        <Text size="sm">{learnDetail.exam.description}</Text>
                    </div>

                    <div>
                        <List type="ordered" className="list-decimal">
                            {learnDetail.exam.questions.map((question) => (
                                <List.Item key={question.id}>
                                    <Text size="sm" fw={500} mb="xs">
                                        {question.content}
                                    </Text>

                                    <div className="mt-2">
                                        <Controller
                                            name={question.id}
                                            control={form.control}
                                            render={({ field }) => (
                                                <Radio.Group
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                >
                                                    <div className="flex flex-col gap-y-2">
                                                        {question.options.map((option) => (
                                                            <div
                                                                className="flex items-center gap-x-2"
                                                                key={option.id}
                                                            >
                                                                <Radio value={option.id} />
                                                                <Text size="sm">
                                                                    {option.content}
                                                                </Text>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </Radio.Group>
                                            )}
                                        />
                                    </div>
                                </List.Item>
                            ))}
                        </List>
                    </div>

                    <Divider my="md" />

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={!isAllQuestionsAnswered || submitExam.isPending}
                            loading={submitExam.isPending}
                            size="md"
                            variant="filled"
                        >
                            {submitExam.isPending ? "Đang nộp bài..." : "Nộp bài kiểm tra"}
                        </Button>
                    </div>
                </div>
            </form>
        </Card>
    );
};

export default LearnExam;
