"use client";

import { useRouter } from "next/navigation";

import { useClerk, useUser } from "@clerk/nextjs";
import { Avatar, Box, Button, Group, Loader, Text } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";

import { navigationPaths } from "@/utils/navigationPaths";

const AuthButton = () => {
    const router = useRouter();

    const { signOut } = useClerk();

    const { user, isLoaded } = useUser();

    const userData = user?.unsafeMetadata;

    // Show loading state while checking authentication
    if (!isLoaded) {
        return (
            <Group gap="xs">
                <Loader size="sm" />
                <Text size="sm" c="dimmed" hiddenFrom="sm">
                    Loading...
                </Text>
            </Group>
        );
    }

    if (!!userData) {
        return (
            <Group className="hover:cursor-pointer">
                <Avatar src={user?.imageUrl || ""} radius="xl" size="sm" />

                <Box style={{ flex: 1 }} visibleFrom="sm">
                    <Text size="sm" fw={500}>
                        {userData?.fullName as string}
                    </Text>

                    <Text c="dimmed" size="xs">
                        {userData?.cccd as string}
                    </Text>
                </Box>

                <Button
                    visibleFrom="sm"
                    variant="default"
                    size="sm"
                    onClick={() => signOut(() => router.push("/"))}
                >
                    <div className="flex items-center gap-x-2">
                        <IconLogout className="text-gray-700" size={16} />
                        <Text visibleFrom="sm">Đăng xuất</Text>
                    </div>
                </Button>
            </Group>
        );
    }

    return (
        <Group gap="xs">
            <Button
                variant="default"
                size="xs"
                onClick={() => router.push(navigationPaths.SIGN_IN)}
            >
                Log in
            </Button>
            <Button size="xs" onClick={() => router.push(navigationPaths.SIGN_UP)}>
                Sign up
            </Button>
        </Group>
    );
};

export default AuthButton;
