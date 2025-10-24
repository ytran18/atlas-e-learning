import { useState } from "react";

import { Button, ScrollArea } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

import Empty from "@/components/Empty";
import { useAtldAdminDetailContext } from "@/features/quan-tri/contexts/AtldAdminDetailContext";
import { useCourseFormContext } from "@/features/quan-tri/contexts/CourseFormContext";
import { ExamQuestion } from "@/types/api";

import ModalQuestion from "../../ModalQuestion";
import QuestionCard from "../../QuestionCard";

const ExamTab = () => {
    // contexts
    const { isEditMode } = useAtldAdminDetailContext();

    const { editExam, handleAddExamQuestion, handleUpdateExamQuestion } = useCourseFormContext();

    // states
    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState<boolean>(false);

    const [modalMode, setModalMode] = useState<"add" | "edit">("add");

    const [editingQuestion, setEditingQuestion] = useState<ExamQuestion | null>(null);

    // Use editExam from form context instead of courseDetail.exam
    const exam = editExam;

    const handleAddQuestion = () => {
        setModalMode("add");

        setEditingQuestion(null);

        setIsQuestionModalOpen(true);
    };

    const handleEditQuestion = (question: ExamQuestion) => {
        setModalMode("edit");

        setEditingQuestion(question);

        setIsQuestionModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsQuestionModalOpen(false);

        setEditingQuestion(null);
    };

    const handleSaveQuestion = (data: any) => {
        if (modalMode === "add") {
            handleAddExamQuestion(data);
        } else if (modalMode === "edit" && editingQuestion) {
            handleUpdateExamQuestion(editingQuestion.id, data);
        }
    };

    if (!exam || exam.questions.length === 0)
        return (
            <div>
                {isEditMode && (
                    <div className="w-full flex justify-end">
                        <Button leftSection={<IconPlus size={16} />} onClick={handleAddQuestion}>
                            Thêm câu hỏi
                        </Button>
                    </div>
                )}

                <Empty title="Chưa thêm câu hỏi" />

                <ModalQuestion
                    opened={isQuestionModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSaveQuestion}
                    editQuestion={editingQuestion}
                    mode={modalMode}
                />
            </div>
        );

    return (
        <div className="flex flex-col gap-y-4 h-full">
            {isEditMode && (
                <div className="w-full flex justify-end">
                    <Button leftSection={<IconPlus size={16} />} onClick={handleAddQuestion}>
                        Thêm câu hỏi
                    </Button>
                </div>
            )}

            <ScrollArea className={`h-[calc(100%-${isEditMode ? "52px" : "0px"})]`}>
                <div className="flex flex-col gap-y-4 h-full overflow-y-auto">
                    {exam.questions.map((question: any, index: number) => (
                        <QuestionCard
                            key={question.id}
                            question={question}
                            index={index}
                            onEdit={handleEditQuestion}
                        />
                    ))}
                </div>
            </ScrollArea>

            <ModalQuestion
                opened={isQuestionModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveQuestion}
                editQuestion={editingQuestion}
                mode={modalMode}
            />
        </div>
    );
};

export default ExamTab;
