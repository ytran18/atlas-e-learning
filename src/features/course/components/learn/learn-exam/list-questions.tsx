import { FunctionComponent } from "react";

import { List, Radio, Text } from "@mantine/core";
import { Controller, useFormContext } from "react-hook-form";

import { useLearnContext } from "@/contexts/LearnContext";
import { ExamQuestion } from "@/types/api";

type ListQuestionsProps = {
    isFinishCourse?: boolean;
    questions: ExamQuestion[];
};

const ListQuestions: FunctionComponent<ListQuestionsProps> = ({ questions, isFinishCourse }) => {
    const { progress } = useLearnContext();

    const { control } = useFormContext();

    const userAnswers = progress?.examResult?.answers;

    if (isFinishCourse) {
        return (
            <List type="ordered" className="list-decimal flex flex-col gap-y-2">
                {questions.map((question) => {
                    const userAnswer = userAnswers?.find(
                        (answer) => answer.questionId === question.id
                    );
                    return (
                        <List.Item key={question.id}>
                            <Text size="sm" fw={500} mb="xs">
                                {question.content}
                            </Text>

                            <div className="mt-2">
                                <Controller
                                    name={question.id}
                                    control={control}
                                    render={({ field }) => (
                                        <Radio.Group
                                            value={userAnswer?.answer}
                                            onChange={field.onChange}
                                        >
                                            <div className="flex flex-col gap-y-2">
                                                {question.options.map((option) => {
                                                    const isCorrectAnswer =
                                                        option.id === question.answer;

                                                    const isUserAnswer =
                                                        userAnswer?.answer === option.id;

                                                    return (
                                                        <div
                                                            className={`flex items-center gap-x-2 ${
                                                                isCorrectAnswer
                                                                    ? "text-green-500"
                                                                    : isUserAnswer
                                                                      ? "text-red-500"
                                                                      : ""
                                                            }`}
                                                            key={option.id}
                                                        >
                                                            <Radio value={option.id} />

                                                            <Text size="sm">{option.content}</Text>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </Radio.Group>
                                    )}
                                />
                            </div>
                        </List.Item>
                    );
                })}
            </List>
        );
    }

    return (
        <List type="ordered" className="list-decimal flex flex-col gap-y-2 mx-2!">
            {questions.map((question) => {
                return (
                    <List.Item key={question.id}>
                        <Text size="sm" fw={500} mb="xs">
                            {question.content}
                        </Text>

                        <div className="mt-2">
                            <Controller
                                name={question.id}
                                control={control}
                                render={({ field }) => (
                                    <Radio.Group value={field.value} onChange={field.onChange}>
                                        <div className="flex flex-col gap-y-2">
                                            {question.options.map((option) => {
                                                // const isCorrectAnswer =
                                                //     option.id === question.answer;

                                                return (
                                                    <div
                                                        className={`flex items-center gap-x-2`}
                                                        key={option.id}
                                                    >
                                                        <Radio value={option.id} />

                                                        <Text size="sm">{option.content}</Text>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </Radio.Group>
                                )}
                            />
                        </div>
                    </List.Item>
                );
            })}
        </List>
    );
};

export default ListQuestions;
