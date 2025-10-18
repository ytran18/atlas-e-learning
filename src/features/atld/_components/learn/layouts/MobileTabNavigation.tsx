import { Tabs } from "@mantine/core";

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
            <Tabs.Panel value="0" className="h-full">
                <div className="h-full">{children.theory}</div>
            </Tabs.Panel>

            <Tabs.Panel value="1" className="h-full">
                <div className="h-full">{children.practice}</div>
            </Tabs.Panel>

            <Tabs.Panel value="2" className="h-full">
                <div className="h-full">{children.exam}</div>
            </Tabs.Panel>
        </Tabs>
    );
};

export default MobileTabNavigation;
