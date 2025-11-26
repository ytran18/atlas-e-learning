import { FunctionComponent, ReactNode } from "react";

import { Tabs, Text } from "@mantine/core";

type DocsTabsSlot = {
    File: () => ReactNode;
    Video: () => ReactNode;
};

export enum DocsTabs {
    FILE = "file",
    VIDEO = "video",
}

type AdminDocsTabsProps = {
    slots: DocsTabsSlot;
};

const AdminDocsTabs: FunctionComponent<AdminDocsTabsProps> = ({ slots }) => {
    return (
        <Tabs
            defaultValue={DocsTabs.FILE}
            variant="pills"
            classNames={{
                root: "flex! flex-col! gap-y-2!",
                list: "",
                panel: "h-[calc(100vh-200px)] sm:h-[calc(100vh-320px)] w-full",
            }}
        >
            <Tabs.List>
                <Tabs.Tab value={DocsTabs.FILE}>
                    <Text fw={600} size="sm">
                        File
                    </Text>
                </Tabs.Tab>

                <Tabs.Tab value={DocsTabs.VIDEO}>
                    <Text fw={600} size="sm">
                        Video
                    </Text>
                </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value={DocsTabs.FILE}>{slots.File()}</Tabs.Panel>

            <Tabs.Panel value={DocsTabs.VIDEO}>{slots.Video()}</Tabs.Panel>
        </Tabs>
    );
};

export default AdminDocsTabs;
