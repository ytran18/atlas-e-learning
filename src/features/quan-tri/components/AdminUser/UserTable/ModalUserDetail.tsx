import { FunctionComponent, useState } from "react";

import { Modal } from "@mantine/core";

import { CourseDetail, StudentStats } from "@/types/api";

import ModalUserDetailExam from "./ModalUserDetailExam";
import ModalUserDetailInfo from "./ModalUserDetailInfo";

type ModalUserDetailProps = {
    opened: boolean;
    onClose: () => void;
    user: StudentStats | null;
    courseDetail?: CourseDetail;
    onDeleteSuccess?: () => void;
};

export enum UserDetailTabs {
    INFO = "info",
    EXAM = "exam",
}

const ModalUserDetail: FunctionComponent<ModalUserDetailProps> = ({
    opened,
    onClose,
    user,
    courseDetail,
    onDeleteSuccess,
}) => {
    const [tab, setTab] = useState<UserDetailTabs>(UserDetailTabs.INFO);

    if (!user || !courseDetail) return null;

    const isCompleted = user?.isCompleted;

    const isTheoryCompleted =
        user?.currentSection === "practice" || user?.currentSection === "exam";

    const isPracticeCompleted = user?.currentSection === "exam";

    const examQuesions = courseDetail?.exam?.questions ?? [];

    const userAnswers = user.examResult?.answers ?? [];

    const handleClose = () => {
        setTab(UserDetailTabs.INFO);
        onClose();
    };

    console.log({ user });

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title={user?.fullname}
            closeOnEscape={false}
            centered
            size="lg"
        >
            {tab === UserDetailTabs.INFO && (
                <ModalUserDetailInfo
                    user={user}
                    isCompleted={isCompleted}
                    isTheoryCompleted={isTheoryCompleted}
                    isPracticeCompleted={isPracticeCompleted}
                    setTab={setTab}
                    onClose={onClose}
                    onDeleteSuccess={onDeleteSuccess}
                />
            )}

            {tab === UserDetailTabs.EXAM && (
                <ModalUserDetailExam
                    examQuestions={examQuesions}
                    userAnswers={userAnswers}
                    setTab={setTab}
                />
            )}
        </Modal>
    );
};

export default ModalUserDetail;
