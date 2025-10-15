import { Button, Card } from "@mantine/core";

import VideoPlayer from "@/libs/player/VideoPlayer";

const LearnTheory = () => {
    return (
        <Card
            withBorder
            shadow="sm"
            radius="md"
            padding="xl"
            h="100%"
            className="bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20"
        >
            <div className="flex flex-col gap-6 h-full">
                <VideoPlayer />

                <div className="w-full flex justify-end">
                    <Button size="md" className="px-8 py-3">
                        Tiêp theo
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default LearnTheory;
