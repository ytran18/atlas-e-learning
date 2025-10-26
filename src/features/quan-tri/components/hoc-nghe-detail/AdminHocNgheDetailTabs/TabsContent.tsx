import { Card, Group, Tabs, Text } from "@mantine/core";
import { IconBook, IconCertificate, IconFileText, ReactNode } from "@tabler/icons-react";

import { AdminHocNgheDetailTabs } from "@/features/quan-tri/constants/tabs";

const adminHocNgheDetailTabs = [
    {
        value: AdminHocNgheDetailTabs.THEORY,
        label: "Lý thuyết",
        icon: <IconBook size={20} className="text-blue-600" />,
    },
    {
        value: AdminHocNgheDetailTabs.PRACTICE,
        label: "Phần Thực hành",
        icon: <IconCertificate size={20} className="text-green-600" />,
    },
    {
        value: AdminHocNgheDetailTabs.EXAM,
        label: "Bài kiểm tra",
        icon: <IconFileText size={20} className="text-orange-600" />,
    },
];

type AdminHocNgheDetailTabsSlots = {
    Theory: () => ReactNode;
    Practice: () => ReactNode;
    Exam: () => ReactNode;
};

type TabsContentProps = {
    slots: AdminHocNgheDetailTabsSlots;
};

const TabsContent = ({ slots }: TabsContentProps) => {
    return (
        <Tabs
            defaultValue={AdminHocNgheDetailTabs.THEORY}
            classNames={{
                root: "h-full !flex !flex-col w-full",
                list: "flex-shrink-0 border-b border-gray-200 bg-white mb-3",
                panel: "max-h-[calc(100vh-640px)]",
                tab: "flex-1 text-center py-3 px-2 text-sm font-medium",
            }}
        >
            <Tabs.List>
                {adminHocNgheDetailTabs.map((tab) => (
                    <Tabs.Tab key={tab.value} value={tab.value}>
                        <Card withBorder shadow="sm" radius="md" p="md">
                            <Group gap="sm">
                                {tab.icon}

                                <Text size="sm" fw={500}>
                                    {tab.label}
                                </Text>
                            </Group>
                        </Card>
                    </Tabs.Tab>
                ))}
            </Tabs.List>

            <Tabs.Panel value={AdminHocNgheDetailTabs.THEORY}>{slots.Theory()}</Tabs.Panel>

            <Tabs.Panel value={AdminHocNgheDetailTabs.PRACTICE}>{slots.Practice()}</Tabs.Panel>

            <Tabs.Panel value={AdminHocNgheDetailTabs.EXAM}>{slots.Exam()}</Tabs.Panel>
        </Tabs>
    );
};

export default TabsContent;
