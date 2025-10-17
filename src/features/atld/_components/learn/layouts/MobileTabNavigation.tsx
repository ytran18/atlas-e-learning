import { Tabs } from "@mantine/core";

import { BeakerIcon, BookIcon, CheckCircleIcon } from "../icons";

interface MobileTabNavigationProps {
    activeTab: number;
    onTabChange: (value: string | null) => void;
    children: {
        theory: React.ReactNode;
        practice: React.ReactNode;
        exam: React.ReactNode;
    };
}

const MobileTabNavigation = ({ activeTab, onTabChange, children }: MobileTabNavigationProps) => {
    return (
        <Tabs
            value={activeTab.toString()}
            onChange={onTabChange}
            classNames={{
                root: "h-full flex flex-col",
                list: "flex-shrink-0 border-b border-gray-200 bg-white",
                panel: "flex-1 overflow-hidden",
                tab: "flex-1 text-center py-3 px-2 text-sm font-medium",
            }}
        >
            <Tabs.List className="grid grid-cols-3">
                <Tabs.Tab value="0" className="flex items-center justify-center gap-2">
                    <BookIcon />
                    <span className="hidden xs:inline">Lý thuyết</span>
                </Tabs.Tab>
                <Tabs.Tab value="1" className="flex items-center justify-center gap-2">
                    <BeakerIcon />
                    <span className="hidden xs:inline">Thực hành</span>
                </Tabs.Tab>
                <Tabs.Tab value="2" className="flex items-center justify-center gap-2">
                    <CheckCircleIcon />
                    <span className="hidden xs:inline">Kiểm tra</span>
                </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="0" className="h-full">
                <div className="h-full p-2">{children.theory}</div>
            </Tabs.Panel>

            <Tabs.Panel value="1" className="h-full">
                <div className="h-full p-2">{children.practice}</div>
            </Tabs.Panel>

            <Tabs.Panel value="2" className="h-full">
                <div className="h-full p-2">{children.exam}</div>
            </Tabs.Panel>
        </Tabs>
    );
};

export default MobileTabNavigation;
