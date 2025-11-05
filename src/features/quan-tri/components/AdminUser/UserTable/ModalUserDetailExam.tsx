import { FunctionComponent } from "react";

import { Button, List, Radio, Text } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";

import { ExamAnswer, ExamQuestion } from "@/types/api";

import { UserDetailTabs } from "./ModalUserDetail";

type ModalUserDetailExamProps = {
    examQuestions: ExamQuestion[];
    userAnswers: ExamAnswer[];
    setTab: (tab: UserDetailTabs) => void;
};

const ModalUserDetailExam: FunctionComponent<ModalUserDetailExamProps> = ({
    examQuestions,
    userAnswers,
    setTab,
}) => {
    return (
        <div className="flex flex-col gap-y-4">
            <Button
                leftSection={<IconChevronLeft size={24} />}
                className="!w-fit"
                size="xs"
                onClick={() => setTab(UserDetailTabs.INFO)}
            >
                Quay lại
            </Button>

            <List type="ordered" className="list-decimal flex flex-col gap-y-2">
                {examQuestions.map((question) => {
                    const userAnswer = userAnswers?.find(
                        (answer) => answer.questionId === question.id
                    );

                    return (
                        <List.Item key={question.id}>
                            <Text size="sm" fw={500} mb="xs">
                                {question.content}
                            </Text>

                            <div className="mt-2">
                                <Radio.Group value={userAnswer?.answer}>
                                    <div className="flex flex-col gap-y-3">
                                        {question.options.map((option) => {
                                            const isCorrectAnswer = option.id === question.answer;

                                            const isUserAnswer = userAnswer?.answer === option.id;

                                            return (
                                                <div
                                                    className={`flex gap-x-2 ${
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
                            </div>
                        </List.Item>
                    );
                })}
            </List>
        </div>
    );
};

export default ModalUserDetailExam;
