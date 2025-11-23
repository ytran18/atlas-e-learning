import { Accordion, List } from "@mantine/core";

import AccordionLabel from "../accordion-label";
import VideoItem from "../video-item";

interface VideoContent {
    id: string;
    label: string;
    description: string;
    isCompleted: boolean;
    isAccessible: boolean;
    isActive: boolean;
    section: "theory" | "practice" | "exam";
    index: number;
}

interface SectionItemProps {
    id: string;
    label: string;
    description: string;
    isAccessible: boolean;
    content: VideoContent[];
    onViewAgain: (section: string, index: number) => void;
    onViewExam: () => void;
}

const SectionItem = ({
    id,
    label,
    description,
    // isAccessible,
    content,
    onViewAgain,
    onViewExam,
}: SectionItemProps) => {
    return (
        <Accordion.Item value={id} key={label}>
            <Accordion.Control aria-label={label}>
                <AccordionLabel label={label} description={description} />
            </Accordion.Control>

            <Accordion.Panel>
                <div className="flex flex-col gap-y-2">
                    <List spacing="xl" size="sm" center>
                        {content.map((contentItem) => (
                            <VideoItem
                                key={contentItem.id}
                                {...contentItem}
                                onViewAgain={onViewAgain}
                                onViewExam={onViewExam}
                            />
                        ))}
                    </List>
                </div>
            </Accordion.Panel>
        </Accordion.Item>
    );
};

export default SectionItem;
