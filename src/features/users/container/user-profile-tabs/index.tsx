import { FunctionComponent, ReactNode } from "react";

import { Tabs, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";

type TabsSlot = {
    Info: () => ReactNode;
    Course: () => ReactNode;
};

export enum ProfileTabs {
    INFO = "info",
    COURSE = "course",
}

type UserProfileTabs = {
    slots: TabsSlot;
};

const UserProfileTabs: FunctionComponent<UserProfileTabs> = ({ slots }) => {
    const { t } = useI18nTranslate();

    const isSmallScreen = useMediaQuery("(max-width: 640px)");

    return (
        <Tabs
            defaultValue={ProfileTabs.INFO}
            classNames={{
                root: "flex! flex-col! gap-y-4 h-full",
                tab: "border-b-[4px]!",
                panel: "h-full",
            }}
        >
            <Tabs.List grow>
                <Tabs.Tab value={ProfileTabs.INFO}>
                    <Text fw={600} size={isSmallScreen ? "xs" : "sm"}>
                        {t("thong_tin_ca_nhan")}
                    </Text>
                </Tabs.Tab>

                <Tabs.Tab value={ProfileTabs.COURSE}>
                    <Text fw={600} size={isSmallScreen ? "xs" : "sm"}>
                        {t("khoa_hoc_cua_ban")}
                    </Text>
                </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value={ProfileTabs.INFO}>{slots.Info()}</Tabs.Panel>

            <Tabs.Panel value={ProfileTabs.COURSE}>{slots.Course()}</Tabs.Panel>
        </Tabs>
    );
};

export default UserProfileTabs;
