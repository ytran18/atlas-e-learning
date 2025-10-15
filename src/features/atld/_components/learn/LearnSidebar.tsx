import { Accordion, Group, List, Text, ThemeIcon } from "@mantine/core";
import { IconCircleDashed } from "@tabler/icons-react";

import { useLearnContext } from "@/contexts/LearnContext";

interface AccordionLabelProps {
    label: string;
    description: string;
}

function AccordionLabel({ label, description }: AccordionLabelProps) {
    return (
        <Group wrap="nowrap">
            <div>
                <Text>{label}</Text>

                <Text size="sm" c="dimmed" fw={400}>
                    {description}
                </Text>
            </div>
        </Group>
    );
}

const LearnSidebar = () => {
    const { learnDetail } = useLearnContext();

    const { title } = learnDetail;

    const sidebarLists = [
        {
            id: "theory",
            label: "Bài học lý thuyết",
            description: "Video",
            content: learnDetail.theory.videos.map((video) => ({
                id: video.id,
                label: video.title,
                description: video.description,
            })),
        },
        {
            id: "practice",
            label: "Bài học thực hành",
            description: "Video",
            content: learnDetail.practice.videos.map((video) => ({
                id: video.id,
                label: video.title,
                description: video.description,
            })),
        },
    ];

    const items = sidebarLists.map((item) => (
        <Accordion.Item value={item.id} key={item.label}>
            <Accordion.Control aria-label={item.label}>
                <AccordionLabel {...item} />
            </Accordion.Control>

            <Accordion.Panel>
                <div className="flex flex-col gap-y-2">
                    <List spacing="xl" size="sm" center>
                        {item.content.map((item) => (
                            <List.Item
                                key={item.id}
                                icon={
                                    <ThemeIcon color="blue" size={24} radius="xl">
                                        <IconCircleDashed size={16} />
                                    </ThemeIcon>
                                }
                            >
                                {item.label}
                            </List.Item>
                        ))}
                    </List>
                </div>
            </Accordion.Panel>
        </Accordion.Item>
    ));

    return (
        <div className="border-r border-gray-300 h-full sm:w-1/4">
            <div className="text-xl font-bold text-[rgb(0,86,210)] p-4">{title}</div>

            <Accordion chevronPosition="right" variant="contained">
                {items}
            </Accordion>
        </div>
    );
};

export default LearnSidebar;
