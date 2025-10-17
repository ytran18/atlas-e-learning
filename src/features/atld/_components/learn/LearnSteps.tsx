"use client";

import { FunctionComponent, ReactNode, useEffect, useState } from "react";

import Link from "next/link";

import { Button, Stepper } from "@mantine/core";

import { useLearnContext } from "@/contexts/LearnContext";
import { navigationPaths } from "@/utils/navigationPaths";

type LearnStepSlots = {
    Theory: () => ReactNode;
    Practice: () => ReactNode;
    Exam: () => ReactNode;
};

type LearnStepsProps = {
    slots: LearnStepSlots;
};

const sectionToIndex = {
    theory: 0,
    practice: 1,
    exam: 2,
} as const;

const LearnSteps: FunctionComponent<LearnStepsProps> = ({ slots }) => {
    const { progress } = useLearnContext();

    const { currentSection } = progress;

    const [active, setActive] = useState<number>(sectionToIndex?.[currentSection ?? "theory"]);

    const isCompleted = progress.isCompleted;

    useEffect(() => {
        setActive(sectionToIndex?.[currentSection ?? "theory"]);
    }, [currentSection]);

    return (
        <div className="w-full h-full p-4 grow">
            <Stepper
                h="100%"
                size="xs"
                iconSize={24}
                active={isCompleted ? 3 : active} // Show completed step when course is done
                onStepClick={isCompleted ? undefined : setActive} // Disable step clicking when completed
                classNames={{
                    content: "h-full",
                }}
            >
                <Stepper.Step label="Lý thuyết">{slots.Theory()}</Stepper.Step>

                <Stepper.Step label="Thực hành">{slots.Practice()}</Stepper.Step>

                <Stepper.Step label="Bài Kiểm tra">{slots.Exam()}</Stepper.Step>

                <Stepper.Completed>
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="text-6xl mb-4">🎉</div>
                        <h2 className="text-2xl font-bold text-green-600 mb-2">
                            Chúc mừng bạn đã hoàn thành khóa học!
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Bạn đã hoàn thành tất cả các phần của khóa học này.
                        </p>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md">
                            <p className="text-sm text-green-800">
                                Khóa học đã được đánh dấu là hoàn thành trong hồ sơ học tập của bạn.
                            </p>
                        </div>

                        <Link href={navigationPaths.ATLD}>
                            <Button className="mt-4">Quay về trang chủ</Button>
                        </Link>
                    </div>
                </Stepper.Completed>
            </Stepper>
        </div>
    );
};

export default LearnSteps;
