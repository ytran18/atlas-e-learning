import { FunctionComponent } from "react";

import { Card, Text, Tooltip } from "@mantine/core";
import { IconChevronRight, IconCircleCheck } from "@tabler/icons-react";
import { Image } from "antd";

import { DEFAULT_IMAGE_URL } from "@/constants";
import { StudentStats } from "@/types/api";

import { UserDetailTabs } from "./ModalUserDetail";

type ModalUserDetailInfoProps = {
    user: StudentStats;
    isCompleted: boolean;
    isTheoryCompleted: boolean;
    isPracticeCompleted: boolean;
    setTab: (tab: UserDetailTabs) => void;
};

const ModalUserDetailInfo: FunctionComponent<ModalUserDetailInfoProps> = ({
    user,
    isCompleted,
    isTheoryCompleted,
    isPracticeCompleted,
    setTab,
}) => {
    const handleExamTabClick = () => {
        if (!isCompleted) return;

        setTab(UserDetailTabs.EXAM);
    };

    const renderLabel = isCompleted
        ? "Nhấn vào để xem chi tiết bài kiểm tra"
        : "Chưa hoàn thành khóa học";

    return (
        <div className="w-full flex flex-col gap-y-4">
            <div className="w-full flex items-center justify-between gap-x-2">
                <Card withBorder className="w-full !py-1">
                    <Text size="xs" fw={500} c="dimmed">
                        Ngày sinh
                    </Text>
                    <Text size="sm" fw={500}>
                        {user.birthDate}
                    </Text>
                </Card>

                <Card withBorder className="w-full !py-1">
                    <Text size="xs" fw={500} c="dimmed">
                        Công ty
                    </Text>
                    <Text size="sm" fw={500}>
                        {user.companyName}
                    </Text>
                </Card>
            </div>

            <div className="w-full flex items-center justify-between gap-x-2">
                <div className="w-full flex flex-col items-start justify-between gap-y-1">
                    <Text size="xs" fw={500}>
                        Ảnh lúc đầu
                    </Text>

                    <Image
                        src={user.startImageUrl}
                        alt={user.fullname}
                        className="w-full max-h-[165px] object-cover"
                        fallback={DEFAULT_IMAGE_URL}
                    />
                </div>

                <div className="w-full flex flex-col items-start justify-between gap-y-1">
                    <Text size="xs" fw={500}>
                        Ảnh lúc đang học
                    </Text>

                    <Image
                        src={user.finishImageUrl}
                        alt={user.fullname}
                        className="w-full max-h-[165px] object-cover"
                        fallback={DEFAULT_IMAGE_URL}
                    />
                </div>
            </div>

            <Tooltip label={renderLabel} color={isCompleted ? "green" : "red"} withArrow>
                <Card
                    withBorder
                    className="w-full cursor-pointer hover:!bg-gray-50"
                    onClick={handleExamTabClick}
                >
                    <div className="flex items-center justify-between gap-x-2">
                        <Text size="sm" fw={600}>
                            Kết quả bài kiểm tra
                        </Text>

                        <div className="flex items-center gap-x-3">
                            <Text size="sm" fw={600} c={user.examResult?.passed ? "green" : "red"}>
                                {!isCompleted ? (
                                    <>Chưa làm bài kiểm tra</>
                                ) : (
                                    <>
                                        {user.examResult?.score} / {user.examResult?.totalQuestions}{" "}
                                        ({user.examResult?.passed ? "Đạt" : "Không đạt"})
                                    </>
                                )}
                            </Text>

                            <IconChevronRight size={20} />
                        </div>
                    </div>
                </Card>
            </Tooltip>

            <div className="w-full flex items-center justify-between gap-x-2">
                <Card withBorder className="w-full">
                    <div className="flex flex-col gap-y-2">
                        <div className="flex items-center gap-x-1">
                            <IconCircleCheck
                                size={20}
                                className={isTheoryCompleted ? "text-green-500" : "text-red-500"}
                            />

                            <Text size="sm" fw={600}>
                                Lý thuyết
                            </Text>
                        </div>

                        <Text size="sm" fw={600}>
                            {isTheoryCompleted ? "Đã hoàn thành" : "Chưa hoàn thành"}
                        </Text>
                    </div>
                </Card>

                <Card withBorder className="w-full">
                    <div className="flex flex-col gap-y-2">
                        <div className="flex items-center gap-x-1">
                            <IconCircleCheck
                                size={20}
                                className={isPracticeCompleted ? "text-green-500" : "text-red-500"}
                            />

                            <Text size="sm" fw={600}>
                                Thực hành
                            </Text>
                        </div>

                        <Text size="sm" fw={600}>
                            {isPracticeCompleted ? "Đã hoàn thành" : "Chưa hoàn thành"}
                        </Text>
                    </div>
                </Card>

                <Card withBorder className="w-full">
                    <div className="flex flex-col gap-y-2">
                        <div className="flex items-center gap-x-1">
                            <IconCircleCheck
                                size={20}
                                className={isCompleted ? "text-green-500" : "text-red-500"}
                            />

                            <Text size="sm" fw={600}>
                                Chứng chỉ
                            </Text>
                        </div>

                        <Text size="sm" fw={600}>
                            {isCompleted ? "Đã hoàn thành" : "Chưa hoàn thành"}
                        </Text>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ModalUserDetailInfo;
