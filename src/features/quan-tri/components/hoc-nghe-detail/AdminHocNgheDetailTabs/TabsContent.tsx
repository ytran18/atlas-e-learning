import { useEffect, useState } from "react";

import { Card, Group, Tabs, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconBook, IconCertificate, IconFileText, ReactNode } from "@tabler/icons-react";

import { AdminHocNgheDetailTabs } from "@/features/quan-tri/constants/tabs";
import { useAtldAdminDetailContext } from "@/features/quan-tri/contexts/AdminDetailContext";

const adminHocNgheDetailTabs = [
    {
        value: AdminHocNgheDetailTabs.THEORY,
        label: "Lý thuyết",
        icon: <IconBook size={20} className="text-blue-600" />,
    },
    {
        value: AdminHocNgheDetailTabs.PRACTICE,
        label: "Thực hành",
        icon: <IconCertificate size={20} className="text-green-600" />,
    },
    {
        value: AdminHocNgheDetailTabs.EXAM,
        label: "Kiểm tra",
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
    const isMobile = useMediaQuery("(max-width: 640px)");

    const { isEditMode } = useAtldAdminDetailContext();

    const [tabHeight, setTabHeight] = useState<number>(0);

    useEffect(() => {
        const itemHeader = document.getElementById("admin-hoc-nghe-detail-header");

        if (itemHeader) {
            setTabHeight(itemHeader.clientHeight + 64); // 64 is padding/margin adjustment
        }
    }, [isEditMode]);

    return (
        <Tabs
            defaultValue={AdminHocNgheDetailTabs.THEORY}
            styles={{
                root: {
                    height: `calc(100% - ${tabHeight}px)`,
                },
            }}
            classNames={{
                root: "w-full",
                list: "flex-shrink-0 border-b border-gray-200 bg-white mb-3",
                panel: "h-full",
                tab: "flex-1 text-center !px-2 text-sm font-medium",
            }}
        >
            <Tabs.List>
                {adminHocNgheDetailTabs.map((tab) => (
                    <Tabs.Tab key={tab.value} value={tab.value}>
                        <Card
                            withBorder
                            shadow="sm"
                            radius="md"
                            p="md"
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

            <Tabs.Panel value={AdminHocNgheDetailTabs.THEORY}>{slots.Theory()}</Tabs.Panel>

            <Tabs.Panel value={AdminHocNgheDetailTabs.PRACTICE}>{slots.Practice()}</Tabs.Panel>

            <Tabs.Panel value={AdminHocNgheDetailTabs.EXAM}>{slots.Exam()}</Tabs.Panel>
        </Tabs>
    );
};

export default TabsContent;
