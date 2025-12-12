import { useRouter, useSearchParams } from "next/navigation";

import { Tabs, ThemeIcon } from "@mantine/core";
import { IconBrandYoutube, IconFileTypePdf, ReactNode } from "@tabler/icons-react";

import { useI18nTranslate } from "@/libs/i18n/useI18nTranslate";

type DocumentTabsSlot = {
    File: () => ReactNode;
    Video: () => ReactNode;
};

type DocumentsTabsProps = {
    slots: DocumentTabsSlot;
};

const DocumentsTabs = ({ slots }: DocumentsTabsProps) => {
    const { t } = useI18nTranslate();

    const router = useRouter();

    const searchParams = useSearchParams();

    const currentTab = searchParams.get("tab") || "file";

    const DocsNavItems = [
        {
            value: "file",
            label: t("tai_lieu"),
            icon: IconFileTypePdf,
            color: "blue",
        },
        {
            value: "video",
            label: "Video",
            icon: IconBrandYoutube,
            color: "teal",
        },
    ];

    const handleChangeTab = (tab: string) => {
        router.push(`${window.location.pathname}?tab=${tab}`);
    };

    return (
        <Tabs
            variant="pills"
            radius="md"
            value={currentTab}
            orientation="horizontal"
            classNames={{
                root: "w-full flex! flex-col! gap-y-8!",
                list: "flex flex-nowrap! justify-center !gap-x-4 sm:gap-0",
                tab: "transition-all duration-200 hover:scale-105 data-[active=true]:bg-gradient-to-r data-[active=true]:from-blue-400 data-[active=true]:to-blue-500 data-[active=true]:text-white data-[active=true]:shadow-lg hover:shadow-md w-full sm:w-auto",
            }}
        >
            <Tabs.List>
                {DocsNavItems.map((item) => {
                    const IconComponent = item.icon;

                    const isActive = item.value === currentTab;

                    return (
                        <Tabs.Tab
                            key={item.value}
                            value={item.value}
                            onClick={() => handleChangeTab(item.value)}
                        >
                            <div className="flex items-center gap-2 sm:gap-3 no-underline justify-center sm:justify-start">
                                <ThemeIcon size="md" variant="light" className="bg-transparent!">
                                    <IconComponent
                                        size={20}
                                        className={`${isActive ? "text-white" : ""}`}
                                    />
                                </ThemeIcon>

                                <span className="font-semibold text-sm">{item.label}</span>
                            </div>
                        </Tabs.Tab>
                    );
                })}
            </Tabs.List>

            <Tabs.Panel value="file">{slots.File()}</Tabs.Panel>

            <Tabs.Panel value="video">{slots.Video()}</Tabs.Panel>
        </Tabs>
    );
};

export default DocumentsTabs;
