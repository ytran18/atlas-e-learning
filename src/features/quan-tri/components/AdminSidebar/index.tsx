import { FunctionComponent, PropsWithChildren, useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { Card, Group, Loader, Stack, Text, Title } from "@mantine/core";
import { IconDatabase } from "@tabler/icons-react";

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
    const { atldId, hocNgheId } = useParams();
    const router = useRouter();

    const [navigatingId, setNavigatingId] = useState<string | null>(null);

    useEffect(() => {
        // clear navigating state when route params change
        setNavigatingId(null);
    }, [atldId, hocNgheId]);

    return (
        <div className="flex-shrink-0 w-1/4 hidden sm:block">
            <Card withBorder shadow="md" radius="md" p="md" className="bg-white h-full">
                <div className="w-full flex justify-between items-center mb-4">
                    <Title order={3}>{title}</Title>

                    {children}
                </div>

                {courseList.length === 0 ? (
                    <div className="flex flex-col gap-y-2 items-center">
                        <IconDatabase size={32} />
                        <Text>Chưa có khóa học nào</Text>
                    </div>
                ) : (
                    <Stack gap="sm">
                        {courseList?.map((course) => {
                            const isSelected = course.id === atldId || course.id === hocNgheId;

                            const isNavigating = navigatingId === course.id;

                            return (
                                <Card
                                    key={course.id}
                                    withBorder
                                    shadow="md"
                                    radius="md"
                                    p="md"
                                    onClick={() => {
                                        setNavigatingId(course.id);
                                        onSelectCourse(course);
                                    }}
                                    onMouseEnter={() =>
                                        router.prefetch(`/quan-tri/atld/${course.id}`)
                                    }
                                    aria-busy={isNavigating}
                                    className={`cursor-pointer transition-all duration-200 ${
                                        isSelected
                                            ? "bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300"
                                            : "bg-gray-50 hover:!bg-blue-50"
                                    } ${isNavigating ? "opacity-60" : ""}`}
                                >
                                    <Group justify="space-between" wrap="nowrap">
                                        <Group gap="sm">
                                            <Text fw={500} size="sm">
                                                {course.title}
                                            </Text>
                                        </Group>

                                        {isNavigating && <Loader size="xs" />}
                                    </Group>
                                </Card>
                            );
                        })}
                    </Stack>
                )}
            </Card>
        </div>
    );
};

export default AdminSidebar;
