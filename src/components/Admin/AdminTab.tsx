"use client";

import Link from "next/link";

import { Card, Tabs, ThemeIcon } from "@mantine/core";

import { adminNavItems } from "@/constants/adminNav";

export function AdminTabs({ currentTab }: { currentTab: string }) {
    return (
        <Card shadow="md" radius="lg" p="md" className="bg-white/80 backdrop-blur-sm mb-4 md:mb-8">
            <Tabs
                value={currentTab}
                variant="pills"
                radius="xl"
                color="blue"
                orientation="horizontal"
                classNames={{
                    list: "bg-gray-50 p-2 rounded-xl flex flex-col sm:flex-row justify-center border border-gray-200 gap-2 sm:gap-0",
                    tab: "transition-all duration-200 hover:scale-105 data-[active=true]:bg-gradient-to-r data-[active=true]:from-blue-400 data-[active=true]:to-blue-500 data-[active=true]:text-white data-[active=true]:shadow-lg hover:shadow-md w-full sm:w-auto",
                }}
            >
                <Tabs.List>
                    {adminNavItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <Tabs.Tab
                                key={item.value}
                                value={item.value}
                                className="px-3 py-2 sm:px-6 sm:py-3"
                            >
                                <Link
                                    href={item.href}
                                    className="flex items-center gap-2 sm:gap-3 text-gray-700 no-underline justify-center sm:justify-start"
                                >
                                    <ThemeIcon
                                        size="sm"
                                        variant="light"
                                        color={item.color}
                                        radius="xl"
                                    >
                                        <IconComponent size={16} />
                                    </ThemeIcon>
                                    <span className="font-semibold text-sm sm:text-base">
                                        {item.label}
                                    </span>
                                </Link>
                            </Tabs.Tab>
                        );
                    })}
                </Tabs.List>
            </Tabs>
        </Card>
    );
}
