"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Box, Group } from "@mantine/core";

import { navigationPaths } from "@/utils/navigationPaths";

import AuthButton from "./AuthButton";

const GlobalHeader = () => {
    const router = useRouter();
    return (
        <Box className="sticky top-0 z-50 supports-[backdrop-filter]:bg-white">
            <header className="h-[60px] pl-[var(--mantine-spacing-md)] pr-[var(--mantine-spacing-md)] border-b border-[var(--mantine-color-gray-3)]">
                <Group justify="space-between" h="100%">
                    <Image
                        src="/images/atld-logo.webp"
                        alt="ATLD Logo"
                        width={120}
                        height={40}
                        onClick={() => router.push(navigationPaths.LANDING_PAGE)}
                        className="cursor-pointer"
                        priority
                    />

                    <Group h="100%" gap={0} visibleFrom="sm">
                        <Link
                            href={navigationPaths.LANDING_PAGE}
                            className="flex items-center h-[42px] sm:h-full w-full sm:w-auto pl-[var(--mantine-spacing-md)] pr-[var(--mantine-spacing-md)] no-underline text-[var(--mantine-color-black)] font-medium hover:bg-[var(--mantine-color-gray-0)]"
                            style={{
                                fontSize: "var(--mantine-font-size-sm)",
                            }}
                        >
                            Trang chủ
                        </Link>

                        <Link
                            href={navigationPaths.ATLD}
                            className="flex items-center h-[42px] sm:h-full w-full sm:w-auto pl-[var(--mantine-spacing-md)] pr-[var(--mantine-spacing-md)] no-underline text-[var(--mantine-color-black)] font-medium hover:bg-[var(--mantine-color-gray-0)]"
                            style={{
                                fontSize: "var(--mantine-font-size-sm)",
                            }}
                        >
                            Đào tạo ATLD
                        </Link>

                        <Link
                            href="/"
                            className="flex items-center h-[42px] sm:h-full w-full sm:w-auto pl-[var(--mantine-spacing-md)] pr-[var(--mantine-spacing-md)] no-underline text-[var(--mantine-color-black)] font-medium hover:bg-[var(--mantine-color-gray-0)]"
                            style={{
                                fontSize: "var(--mantine-font-size-sm)",
                            }}
                        >
                            Học nghề
                        </Link>

                        <Link
                            href={navigationPaths.ADMIN}
                            className="flex items-center h-[42px] sm:h-full w-full sm:w-auto pl-[var(--mantine-spacing-md)] pr-[var(--mantine-spacing-md)] no-underline text-[var(--mantine-color-black)] font-medium hover:bg-[var(--mantine-color-gray-0)]"
                            style={{
                                fontSize: "var(--mantine-font-size-sm)",
                            }}
                        >
                            Quản trị
                        </Link>
                    </Group>

                    <AuthButton />
                </Group>
            </header>
        </Box>
    );
};

export default GlobalHeader;
