import { Accordion, Button, Group, List, Text, ThemeIcon } from "@mantine/core";
import { IconCheck, IconCircleDashed, IconLock } from "@tabler/icons-react";

import { useLearnContext } from "@/contexts/LearnContext";
import { navigationPaths } from "@/utils/navigationPaths";

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
    const { learnDetail, progress } = useLearnContext();

    const { title } = learnDetail;
    const { currentSection, currentVideoIndex, completedVideos, isCompleted } = progress;

    // Helper function to check if a video is completed
    const isVideoCompleted = (section: string, index: number) => {
        return completedVideos.some(
            (completed) => completed.section === section && completed.index === index
        );
    };

    // Helper function to check if a video is currently active
    const isVideoActive = (section: string, index: number) => {
        // Check if this is the current section and video
        const isCurrentVideo =
            (currentSection || "theory") === section && (currentVideoIndex || 0) === index;

        // Fallback: if currentVideoIndex is 0 or undefined, highlight first video of current section
        const isFirstVideoOfCurrentSection =
            currentSection === section &&
            (currentVideoIndex === 0 || currentVideoIndex === undefined) &&
            index === 0;

        const isActive = isCurrentVideo || isFirstVideoOfCurrentSection;

        return isActive;
    };

    // Helper function to check if a section is accessible
    const isSectionAccessible = (sectionId: string) => {
        if (isCompleted) return true; // If course is completed, all sections are accessible
        if (sectionId === "theory") return true; // Theory is always accessible
        if (sectionId === "practice") {
            // Practice is accessible if all theory videos are completed
            return learnDetail.theory.videos.every((_, index) => isVideoCompleted("theory", index));
        }
        if (sectionId === "exam") {
            // Exam is accessible if all theory and practice videos are completed
            const allTheoryCompleted = learnDetail.theory.videos.every((_, index) =>
                isVideoCompleted("theory", index)
            );
            const allPracticeCompleted = learnDetail.practice.videos.every((_, index) =>
                isVideoCompleted("practice", index)
            );
            return allTheoryCompleted && allPracticeCompleted;
        }
        return false;
    };

    const sidebarLists = [
        {
            id: "theory",
            label: "Bài học lý thuyết",
            description: "Video",
            isAccessible: isSectionAccessible("theory"),
            content: learnDetail.theory.videos.map((video, index) => ({
                id: video.url,
                label: video.title,
                description: video.description,
                isCompleted: isVideoCompleted("theory", index),
                isAccessible: true, // Theory videos are always accessible
                isActive: isVideoActive("theory", index),
                section: "theory" as const,
                index,
            })),
        },
        {
            id: "practice",
            label: "Bài học thực hành",
            description: "Video",
            isAccessible: isSectionAccessible("practice"),
            content: learnDetail.practice.videos.map((video, index) => ({
                id: video.url,
                label: video.title,
                description: video.description,
                isCompleted: isVideoCompleted("practice", index),
                isAccessible: isSectionAccessible("practice"),
                isActive: isVideoActive("practice", index),
                section: "practice" as const,
                index,
            })),
        },
        {
            id: "exam",
            label: "Bài kiểm tra",
            description: "Trắc nghiệm",
            isAccessible: isSectionAccessible("exam"),
            content: [
                {
                    id: learnDetail.exam.title,
                    label: learnDetail.exam.title,
                    description: learnDetail.exam.description,
                    isCompleted: isCompleted,
                    isAccessible: isSectionAccessible("exam"),
                    isActive: isVideoActive("exam", 0),
                    section: "exam" as const,
                    index: 0,
                },
            ],
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
                        {item.content.map((contentItem) => {
                            const isCompleted = contentItem.isCompleted;
                            const isAccessible = contentItem.isAccessible;
                            const isActive = contentItem.isActive;

                            return (
                                <List.Item
                                    key={contentItem.id}
                                    icon={
                                        <ThemeIcon
                                            color={
                                                isActive
                                                    ? "orange"
                                                    : isCompleted
                                                      ? "green"
                                                      : isAccessible
                                                        ? "blue"
                                                        : "gray"
                                            }
                                            size={24}
                                            radius="xl"
                                        >
                                            {isActive ? (
                                                <IconCircleDashed size={16} />
                                            ) : isCompleted ? (
                                                <IconCheck size={16} />
                                            ) : isAccessible ? (
                                                <IconCircleDashed size={16} />
                                            ) : (
                                                <IconLock size={16} />
                                            )}
                                        </ThemeIcon>
                                    }
                                >
                                    <div className="flex flex-col gap-y-1">
                                        <div
                                            style={{
                                                backgroundColor: isActive
                                                    ? "rgba(255, 165, 0, 0.2)"
                                                    : undefined,
                                                padding: isActive ? "8px 12px" : undefined,
                                                borderRadius: isActive ? "8px" : undefined,
                                                border: isActive ? "2px solid orange" : undefined,
                                                margin: isActive ? "4px 0" : undefined,
                                            }}
                                        >
                                            <Text
                                                size="sm"
                                                c={
                                                    isActive
                                                        ? "orange"
                                                        : isAccessible
                                                          ? undefined
                                                          : "dimmed"
                                                }
                                                fw={isActive ? 700 : undefined}
                                                style={{
                                                    textDecoration: isCompleted
                                                        ? "line-through"
                                                        : undefined,
                                                    opacity: isAccessible ? 1 : 0.6,
                                                }}
                                            >
                                                {isActive && "▶ "}
                                                {contentItem.label}
                                            </Text>
                                        </div>

                                        {isCompleted && isAccessible && (
                                            <div className="flex gap-x-2">
                                                {contentItem.section === "exam" ? (
                                                    <Button
                                                        size="xs"
                                                        variant="light"
                                                        color="green"
                                                        onClick={() => {
                                                            // Navigate to exam section
                                                            window.location.href = `${navigationPaths.ATLD}/${learnDetail.id}/learn#exam`;
                                                        }}
                                                    >
                                                        Xem lại bài thi
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        size="xs"
                                                        variant="light"
                                                        color="green"
                                                        onClick={() => {
                                                            // Navigate to specific video
                                                            window.location.href = `${navigationPaths.ATLD}/${learnDetail.id}/learn#${contentItem.section}-${contentItem.index}`;
                                                        }}
                                                    >
                                                        Xem lại video
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </List.Item>
                            );
                        })}
                    </List>
                </div>
            </Accordion.Panel>
        </Accordion.Item>
    ));

    return (
        <div className="border-r border-gray-300 h-full min-w-1/4">
            <div className="text-xl font-bold text-[rgb(0,86,210)] p-4">{title}</div>

            <Accordion
                chevronPosition="right"
                variant="contained"
                defaultValue={currentSection || "theory"} // Expand current section by default
            >
                {items}
            </Accordion>
        </div>
    );
};

export default LearnSidebar;
