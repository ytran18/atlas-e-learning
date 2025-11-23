import React from "react";

import { Card } from "@mantine/core";

interface LearnViewProps {
    gradientClass: string;
    videoSlot: React.ReactNode;
    infoSlot: React.ReactNode;
    nextButtonSlot: React.ReactNode;
}

const LearnView = React.memo(function LearnView({
    gradientClass,
    videoSlot,
    infoSlot,
    nextButtonSlot,
}: LearnViewProps) {
    return (
        <Card
            withBorder
            shadow="sm"
            radius="md"
            padding="lg"
            h="100%"
            className={`bg-linear-to-br ${gradientClass} p-0! sm:p-4!`}
        >
            <div className="flex flex-col gap-4 lg:gap-6 h-full">
                {videoSlot}
                {infoSlot}
                {nextButtonSlot}
            </div>
        </Card>
    );
});

export default LearnView;
