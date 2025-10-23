import { Badge, Card, Text, ThemeIcon } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconEdit, IconTrash } from "@tabler/icons-react";

import { ExamQuestion } from "@/types/api";

import { useAtldAdminDetailContext } from "../../contexts/AtldAdminDetailContext";
import { useCourseFormContext } from "../../contexts/CourseFormContext";

type QuestionCardProps = {
    index: number;
    question: ExamQuestion;
    onEdit?: (question: ExamQuestion) => void;
};

const QuestionCard = ({ index, question, onEdit }: QuestionCardProps) => {
    const { isEditMode } = useAtldAdminDetailContext();
    const { handleDeleteExamQuestion } = useCourseFormContext();

    const handleDelete = () => {
        modals.openConfirmModal({
            title: "Xác nhận xóa câu hỏi",
            centered: true,
            children: <Text size="sm">Bạn có chắc chắn muốn xóa câu hỏi này?</Text>,
            labels: { confirm: "Xóa", cancel: "Huỷ" },
            confirmProps: { color: "red" },
            onCancel: () => console.log("Cancel"),
            onConfirm: () => handleDeleteExamQuestion(question.id),
        });
    };

    const handleEdit = () => {
        if (onEdit) {
            onEdit(question);
        }
    };

    return (
        <Card withBorder radius="md">
            <div className="flex flex-col gap-y-2">
                <div className="w-full flex items-center justify-between gap-x-3">
                    <div className="flex items-center gap-x-2">
                        <Badge variant="gradient" color="indigo">
                            <span className="leading-[22px]">Câu {index + 1}</span>
                        </Badge>

                        <Text size="sm" fw={600}>
                            {question.content}
                        </Text>
                    </div>

                    {isEditMode && (
                        <div className="flex items-center gap-x-2">
                            <ThemeIcon
                                variant="filled"
                                color="blue"
                                className="cursor-pointer"
                                onClick={handleEdit}
                            >
                                <IconEdit size={16} />
                            </ThemeIcon>

                            <ThemeIcon
                                variant="filled"
                                color="red"
                                className="cursor-pointer"
                                onClick={handleDelete}
                            >
                                <IconTrash size={16} />
                            </ThemeIcon>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-y-2 ml-4">
                    {question?.options?.map((option) => (
                        <div
                            key={option.id}
                            className={`${option.id === question.answer ? "text-green-600" : ""}`}
                        >
                            <Text size="sm">{option.content}</Text>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};

export default QuestionCard;
