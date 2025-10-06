"use client";

import { useRouter } from "next/navigation";

import { useClerk, useUser } from "@clerk/nextjs";
import { Avatar, Button, Group, Text } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";

import { navigationPaths } from "@/utils/navigationPaths";

const AuthButton = () => {
    const router = useRouter();

    const { signOut } = useClerk();

    const { user } = useUser();

    const userData = user?.unsafeMetadata;

    if (!!userData) {
        return (
            <Group visibleFrom="sm" className="hover:cursor-pointer">
                <Avatar src={user?.imageUrl || ""} radius="xl" />

                <div style={{ flex: 1 }}>
                    <Text size="sm" fw={500}>
                        {userData?.fullName as string}
                    </Text>

                    <Text c="dimmed" size="xs">
                        {userData?.cccd as string}
                    </Text>
                </div>

                <Button variant="default" onClick={() => signOut(() => router.push("/"))}>
                    <div className="flex items-center gap-x-2">
                        <IconLogout className="text-gray-700" />
                        Đăng xuất
                    </div>
                </Button>
            </Group>
        );
    }

    return (
        <Group visibleFrom="sm">
            <Button variant="default" onClick={() => router.push(navigationPaths.SIGN_IN)}>
                Log in
            </Button>
            <Button onClick={() => router.push(navigationPaths.SIGN_UP)}>Sign up</Button>
        </Group>
    );
};

export default AuthButton;
