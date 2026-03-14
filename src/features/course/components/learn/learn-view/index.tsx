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
            className={`bg-linear-to-br ${gradientClass} p-0! sm:p-4! w-full min-w-0 flex flex-col overflow-hidden`}
        >
            <div className="flex flex-col gap-4 lg:gap-6 h-full w-full min-w-0 overflow-hidden">
                <div className="flex-1 min-h-0 min-w-0 w-full rounded-md relative bg-black overflow-hidden flex items-center justify-center">
                    <div className="w-full h-full max-h-full max-w-full relative">{videoSlot}</div>
                </div>

                <div className="shrink-0">
                    {infoSlot}
                    {nextButtonSlot}
                </div>
            </div>
        </Card>
    );
});

export default LearnView;
