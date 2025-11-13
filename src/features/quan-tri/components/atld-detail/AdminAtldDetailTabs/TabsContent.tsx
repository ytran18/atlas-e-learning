import { Card, Group, Tabs, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconBook, IconCertificate, IconFileText, ReactNode } from "@tabler/icons-react";

import { AdminAtldDetailTabs } from "@/features/quan-tri/constants/tabs";

const adminAtldDetailTabs = [
    {
        value: AdminAtldDetailTabs.THEORY,
        label: "Lý thuyết",
        icon: <IconBook size={20} className="text-blue-600" />,
    },
    {
        value: AdminAtldDetailTabs.PRACTICE,
        label: "Thực hành",
        icon: <IconCertificate size={20} className="text-green-600" />,
    },
    {
        value: AdminAtldDetailTabs.EXAM,
        label: "Kiểm tra",
        icon: <IconFileText size={20} className="text-orange-600" />,
    },
];

type AdminAtldDetailTabsSlots = {
    Theory: () => ReactNode;
    Practice: () => ReactNode;
    Exam: () => ReactNode;
};

type TabsContentProps = {
    slots: AdminAtldDetailTabsSlots;
};

const TabsContent = ({ slots }: TabsContentProps) => {
    const isMobile = useMediaQuery("(max-width: 640px)");

    return (
        <Tabs
            defaultValue={AdminAtldDetailTabs.THEORY}
            classNames={{
                root: "w-full h-full",
                list: "flex-shrink-0 border-b border-gray-200 bg-white mb-3",
                panel: "h-[calc(100%-80px)]",
                tab: "text-center !px-2 text-sm font-medium",
            }}
        >
            <Tabs.List>
                {adminAtldDetailTabs.map((tab) => (
                    <Tabs.Tab key={tab.value} value={tab.value}>
                        <Card
                            withBorder
                            shadow="sm"
                            radius="md"
                            p="sm"
                            className={`${isMobile ? "p-2!" : ""}`}
                        >
                            <Group gap="sm" className={`${isMobile ? "justify-center!" : ""}`}>
                                {!isMobile && tab.icon}

                                <Text size="sm" fw={500}>
                                    {tab.label}
                                </Text>
                            </Group>
                        </Card>
                    </Tabs.Tab>
                ))}
            </Tabs.List>

            <Tabs.Panel value={AdminAtldDetailTabs.THEORY}>{slots.Theory()}</Tabs.Panel>

            <Tabs.Panel value={AdminAtldDetailTabs.PRACTICE}>{slots.Practice()}</Tabs.Panel>

            <Tabs.Panel value={AdminAtldDetailTabs.EXAM}>{slots.Exam()}</Tabs.Panel>
        </Tabs>
    );
};

export default TabsContent;
