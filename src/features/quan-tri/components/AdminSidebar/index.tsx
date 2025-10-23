import { FunctionComponent, PropsWithChildren } from "react";

import { useParams } from "next/navigation";

import { Card, Group, Stack, Text, Title } from "@mantine/core";

import { CourseListItem, GetCourseListResponse } from "@/types/api";

type AdminSidebarProps = PropsWithChildren<{
    title: string;
    courseList: GetCourseListResponse;
    onSelectCourse: (course: CourseListItem) => void;
}>;

const AdminSidebar: FunctionComponent<AdminSidebarProps> = ({
    title,
    courseList,
    onSelectCourse,
    children,
}) => {
    const { atldId } = useParams();

    return (
        <div className="flex-shrink-0">
            <Card withBorder shadow="md" radius="md" p="md" className="bg-white h-full">
                <div className="w-full flex justify-between items-center mb-4">
                    <Title order={3}>{title}</Title>

                    {children}
                </div>

                <Stack gap="sm">
                    {courseList.map((course) => {
                        const isSelected = course.id === atldId;

                        return (
                            <Card
                                key={course.id}
                                withBorder
                                shadow="md"
                                radius="md"
                                p="md"
                                onClick={() => onSelectCourse(course)}
                                className={`cursor-pointer transition-all duration-200 ${
                                    isSelected
                                        ? "bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300"
                                        : "bg-gray-50 hover:bg-blue-50"
                                }`}
                            >
                                <Group justify="space-between">
                                    <Group gap="sm">
                                        <Text fw={500} size="sm">
                                            {course.title}
                                        </Text>
                                    </Group>
                                </Group>
                            </Card>
                        );
                    })}
                </Stack>
            </Card>
        </div>
    );
};

export default AdminSidebar;
