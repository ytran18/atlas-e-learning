"use client";

import { Button, Card, Group, List, Text, ThemeIcon } from "@mantine/core";
import { IconArrowRight, IconCircleCheck } from "@tabler/icons-react";

import { Course, LessionType } from "@/types/course";

type AtldPreviewCardProps = {
    course: Course;
};

const AtldPreviewCard = ({ course }: AtldPreviewCardProps) => {
    const numberOfPracticeLessons = course.lessons.filter(
        (lesson) => lesson.type === LessionType.PRACTICE
    ).length;

    const numberOfTheoryLessons = course.lessons.filter(
        (lesson) => lesson.type === LessionType.THEORY
    ).length;

    // const numberOfExamQuestions = course.exam?.questions.length || 0;

    return (
        <Card withBorder shadow="sm" radius="md">
            <Card.Section withBorder inheritPadding py="xs">
                <Group justify="space-between">
                    <Text fw={700} size="xl">
                        {course.title}
                    </Text>
                </Group>
            </Card.Section>

            <Group justify="space-between" gap="lg" h="100%">
                <Text mt="sm" c="dimmed" size="sm" mb="lg">
                    {course.description}
                </Text>

                <List
                    spacing="xs"
                    size="sm"
                    center
                    mb="lg"
                    icon={
                        <ThemeIcon color="teal" size={24} radius="xl">
                            <IconCircleCheck size={16} />
                        </ThemeIcon>
                    }
                >
                    <List.Item>
                        <Text>{numberOfPracticeLessons} bài học thực hành</Text>
                    </List.Item>

                    <List.Item>
                        <Text>{numberOfTheoryLessons} bài học lý thuyết</Text>
                    </List.Item>

                    <List.Item>
                        <Text>{numberOfTheoryLessons} câu hỏi kiểm tra</Text>
                    </List.Item>
                </List>

                <Button rightSection={<IconArrowRight size={14} />} fullWidth>
                    Xem chi tiết
                </Button>
            </Group>
        </Card>
    );
};

export default AtldPreviewCard;
