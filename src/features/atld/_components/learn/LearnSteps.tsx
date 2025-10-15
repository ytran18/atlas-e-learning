"use client";

import { FunctionComponent, ReactNode, useState } from "react";

import { Stepper } from "@mantine/core";

type LearnStepSlots = {
    Theory: () => ReactNode;
    Practice: () => ReactNode;
    Exam: () => ReactNode;
};

type LearnStepsProps = {
    slots: LearnStepSlots;
};

const LearnSteps: FunctionComponent<LearnStepsProps> = ({ slots }) => {
    const [active, setActive] = useState<number>(0);

    // const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));

    // const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

    return (
        <div className="w-full h-full p-4">
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
    );
};

export default LearnSteps;
