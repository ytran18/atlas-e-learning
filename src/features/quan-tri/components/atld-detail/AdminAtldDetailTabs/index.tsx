import { Card, Group, Tabs, Text } from "@mantine/core";
import { IconBook, IconCertificate, IconFileText } from "@tabler/icons-react";

import { useCourseFormContext } from "@/features/quan-tri/contexts/CourseFormContext";

import ExamTab from "./ExamTab";
import PracticeTab from "./PracticeTab";
import TheoryTab from "./TheoryTab";

const AdminAtldDetailTabs = () => {
    const { error } = useCourseFormContext();

    return (
        <div className="flex flex-col h-full">
            {/* Error message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <Tabs
                defaultValue="theory"
                classNames={{
                    root: "h-full flex flex-col",
                    list: "flex-shrink-0 border-b border-gray-200 bg-white mb-3",
                    panel: "flex-1 overflow-hidden",
                    tab: "flex-1 text-center py-3 px-2 text-sm font-medium",
                }}
            >
                <Tabs.List>
                    <Tabs.Tab value="theory">
                        <Card withBorder shadow="sm" radius="md" p="md">
                            <Group gap="sm">
                                <IconBook size={20} className="text-blue-600" />

                                <Text size="sm" fw={500}>
                                    Lý thuyết
                                </Text>
                            </Group>
                        </Card>
                    </Tabs.Tab>

                    <Tabs.Tab value="practice">
                        <Card withBorder shadow="sm" radius="md" p="md">
                            <Group gap="sm">
                                <IconCertificate size={20} className="text-green-600" />

                                <Text size="sm" fw={500}>
                                    Phần Thực hành
                                </Text>
                            </Group>
                        </Card>
                    </Tabs.Tab>

                    <Tabs.Tab value="exam">
                        <Card withBorder shadow="sm" radius="md" p="md">
                            <Group gap="sm">
                                <IconFileText size={20} className="text-orange-600" />

                                <Text size="sm" fw={500}>
                                    Bài kiểm tra
                                </Text>
                            </Group>
                        </Card>
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="theory">
                    <TheoryTab />
                </Tabs.Panel>

                <Tabs.Panel value="practice">
                    <PracticeTab />
                </Tabs.Panel>

                <Tabs.Panel value="exam">
                    <ExamTab />
                </Tabs.Panel>
            </Tabs>
        </div>
    );
};

export default AdminAtldDetailTabs;
