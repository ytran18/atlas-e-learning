"use client";

import { FunctionComponent, ReactNode, useEffect, useState } from "react";

import { Stepper } from "@mantine/core";

import { useLearnContext } from "@/contexts/LearnContext";

import { CompletedContent } from "../content";
import { MobileTabNavigation } from "../layouts";

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

    const handleTabChange = (value: string | null) => {
        if (value && !isCompleted) {
            const newIndex = parseInt(value);
            setActive(newIndex);
        }
    };

    if (isCompleted) {
        return (
            <div className="w-full h-full">
                <CompletedContent />
            </div>
        );
    }

    return (
        <div className="w-full h-full">
            {/* Mobile Layout - Horizontal Tabs */}
            <div className="lg:hidden h-full flex flex-col">
                <MobileTabNavigation activeTab={active} onTabChange={handleTabChange}>
                    {{
                        theory: slots.Theory(),
                        practice: slots.Practice(),
                        exam: slots.Exam(),
                    }}
                </MobileTabNavigation>
            </div>

            {/* Desktop Layout - Vertical Stepper */}
            <div className="hidden lg:block w-full h-full p-4">
                <Stepper
                    h="100%"
                    size="xs"
                    iconSize={24}
                    active={active}
                    onStepClick={setActive}
                    classNames={{
                        content: "h-full",
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
