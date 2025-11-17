"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useClerk } from "@clerk/nextjs";
import { Card, Loader, Tabs, ThemeIcon } from "@mantine/core";
import { IconHammer, IconShield, IconUsers } from "@tabler/icons-react";

import { navigationPaths } from "@/utils/navigationPaths";

import { getCurrentAdminPathname } from "../../utils/get-current-admin-pathname";

export const adminNavItems = [
    {
        value: "atld",
        label: "An toàn lao động",
        icon: IconShield,
        color: "blue",
        href: navigationPaths.QUAN_TRI_ATLD,
    },
    {
        value: "hoc-nghe",
        label: "Học nghề",
        icon: IconHammer,
        color: "orange",
        href: navigationPaths.QUAN_TRI_HOC_NGHE,
    },
    {
        value: "user",
        label: "Người dùng",
        icon: IconUsers,
        color: "teal",
        href: navigationPaths.QUAN_TRI_USER,
    },
];

const AdminTabs = () => {
    const pathname = usePathname();

    const { user } = useClerk();

    const router = useRouter();

    const [navigatingTab, setNavigatingTab] = useState<string | null>(null);

    const isAdmin = user?.unsafeMetadata?.role === "admin" ? true : false;

    const currentTab = getCurrentAdminPathname(pathname, !isAdmin);

    useEffect(() => {
        // clear navigating state when route changes
        setNavigatingTab(null);
    }, [pathname]);

    return (
        <Card
            withBorder
            radius="md"
            p="md"
            visibleFrom="md"
            className="h-[70px] max-h-[70px] min-h-[70px]"
        >
            <Tabs
                value={currentTab}
                variant="pills"
                radius="md"
                orientation="horizontal"
                classNames={{
                    list: "flex flex-col sm:flex-row justify-center !gap-x-4 sm:gap-0",
                    tab: "transition-all duration-200 hover:scale-105 data-[active=true]:bg-gradient-to-r data-[active=true]:from-blue-400 data-[active=true]:to-blue-500 data-[active=true]:text-white data-[active=true]:shadow-lg hover:shadow-md w-full sm:w-auto",
                }}
            >
                <Tabs.List>
                    {adminNavItems.map((item) => {
                        const IconComponent = item.icon;

                        const isActive = item.value === currentTab;

                        const isNavigating = navigatingTab === item.value;

                        if ((item.value === "atld" || item.value === "hoc-nghe") && !isAdmin) {
                            return null;
                        }

                        return (
                            <Tabs.Tab
                                key={item.value}
                                value={item.value}
                                className={`px-3 sm:px-6 !py-1 !rounded-sm ${
                                    isNavigating ? "opacity-60 pointer-events-none" : ""
                                }`}
                                onMouseEnter={() => router.prefetch(item.href)}
                            >
                                <Link
                                    href={item.href}
                                    className="flex items-center gap-2 sm:gap-3 no-underline justify-center sm:justify-start"
                                    onClick={() => setNavigatingTab(item.value)}
                                >
                                    <ThemeIcon
                                        size="md"
                                        variant="light"
                                        color={item.color}
                                        className="!bg-transparent"
                                    >
                                        {isNavigating ? (
                                            <Loader size={14} />
                                        ) : (
                                            <IconComponent
                                                size={16}
                                                className={`${isActive ? "text-white" : ""}`}
                                            />
                                        )}
                                    </ThemeIcon>

                                    <span className="font-semibold text-sm">{item.label}</span>
                                </Link>
                            </Tabs.Tab>
                        );
                    })}
                </Tabs.List>
            </Tabs>
        </Card>
    );
};

export default AdminTabs;
