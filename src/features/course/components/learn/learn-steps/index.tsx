"use client";

import { FunctionComponent, ReactNode, useEffect, useState } from "react";

import { useSearchParams } from "next/navigation";

import { Stepper } from "@mantine/core";

import { useLearnContext } from "@/contexts/LearnContext";

import CompletedContent from "./completed-content";
import MobileTabNavigation from "./mobile-tab-navigation";

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
    const searchParams = useSearchParams();

    const viewAgain = searchParams.get("viewAgain");

    const { progress, currentSection } = useLearnContext();

    const [active, setActive] = useState<number>(
        sectionToIndex[currentSection as keyof typeof sectionToIndex] ?? 0
    );

    const isCompleted = progress.isCompleted;

    useEffect(() => {
        const newActive = sectionToIndex[currentSection as keyof typeof sectionToIndex] ?? 0;
        setActive(newActive);
    }, [currentSection]);

    const handleTabChange = (value: string | null) => {
        if (value && !isCompleted) {
            const newIndex = parseInt(value);
            setActive(newIndex);
        }
    };

    if (isCompleted && !viewAgain) {
        return (
            <div className="w-full h-full">
                <CompletedContent />
            </div>
        );
    }

    return (
        <div className="w-full h-full overflow-hidden">
            {/* Mobile Layout - Horizontal Tabs */}
            <MobileTabNavigation activeTab={active} onTabChange={handleTabChange}>
                {{
                    theory: slots.Theory(),
                    practice: slots.Practice(),
                    exam: slots.Exam(),
                }}
            </MobileTabNavigation>

            {/* Desktop Layout - Vertical Stepper */}
            <div className="hidden lg:block w-full h-full overflow-hidden">
                <Stepper
                    h="100%"
                    size="xs"
                    iconSize={24}
                    active={active}
                    onStepClick={setActive}
                    classNames={{
                        content: "h-full overflow-hidden !pt-0",
                        steps: "h-0 !hidden",
                        step: "h-full",
                    }}
                >
                    <Stepper.Step label="Lý thuyết">{slots.Theory()}</Stepper.Step>

                    <Stepper.Step label="Thực hành">{slots.Practice()}</Stepper.Step>

                    <Stepper.Step label="Bài Kiểm tra">{slots.Exam()}</Stepper.Step>
                </Stepper>
            </div>
        </div>
    );
};

export default LearnSteps;
