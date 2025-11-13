import { Button, List, Text, ThemeIcon } from "@mantine/core";
import { IconCheck, IconCircleDashed, IconLock } from "@tabler/icons-react";

interface VideoItemProps {
    id: string;
    label: string;
    description: string;
    isCompleted: boolean;
    isAccessible: boolean;
    isActive: boolean;
    section: "theory" | "practice" | "exam";
    index: number;
    onViewAgain: (section: string, index: number) => void;
    onViewExam: () => void;
}

const VideoItem = ({
    id,
    label,
    // description,
    isCompleted,
    isAccessible,
    isActive,
    section,
    index,
    onViewAgain,
    onViewExam,
}: VideoItemProps) => {
    const getIcon = () => {
        if (isActive) return <IconCircleDashed size={16} />;

        if (isCompleted) return <IconCheck size={16} />;

        if (isAccessible) return <IconCircleDashed size={16} />;

        return <IconLock size={16} />;
    };

    const getIconColor = () => {
        if (isActive) return "orange";

        if (isCompleted) return "green";

        if (isAccessible) return "blue";

        return "gray";
    };

    const getTextColor = () => {
        if (isActive) return "orange";

        if (!isAccessible) return "dimmed";

        return undefined;
    };

    const getTextStyle = () => ({
        textDecoration: isCompleted ? "line-through" : undefined,
        opacity: isAccessible ? 1 : 0.6,
    });

    const getContainerStyle = () => ({
        backgroundColor: isActive ? "rgba(255, 165, 0, 0.2)" : undefined,
        padding: isActive ? "8px 12px" : undefined,
        borderRadius: isActive ? "8px" : undefined,
        border: isActive ? "2px solid orange" : undefined,
        margin: isActive ? "4px 0" : undefined,
    });

    return (
        <List.Item
            key={id}
            icon={
                <ThemeIcon color={getIconColor()} size={24} radius="xl">
                    {getIcon()}
                </ThemeIcon>
            }
        >
            <div className="flex flex-col gap-y-1">
                <div style={getContainerStyle()}>
                    <Text
                        size="sm"
                        c={getTextColor()}
                        fw={isActive ? 700 : undefined}
                        style={getTextStyle()}
                    >
                        {isActive && "▶ "}
                        {label}
                    </Text>
                </div>

                {isCompleted && isAccessible && (
                    <div className="flex gap-x-2">
                        {section === "exam" ? (
                            <Button size="xs" variant="light" color="green" onClick={onViewExam}>
                                Xem lại bài thi
                            </Button>
                        ) : (
                            <Button
                                size="xs"
                                variant="light"
                                color="green"
                                onClick={() => onViewAgain(section, index)}
                            >
                                Xem lại video
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </List.Item>
    );
};

export default VideoItem;
