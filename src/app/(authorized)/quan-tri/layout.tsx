"use client";

import { redirect } from "next/navigation";

import { useClerk } from "@clerk/nextjs";
import { Container } from "@mantine/core";

import AdminTabs from "@/features/quan-tri/components/AdminTabs";
import Header from "@/features/quan-tri/components/Header";
import { navigationPaths } from "@/utils/navigationPaths";

export default function Layout({ children }: { children: React.ReactNode }) {
    const { user } = useClerk();

    const isAdmin = user?.publicMetadata.role === "admin";

    if (!isAdmin) {
        redirect(navigationPaths.LANDING_PAGE);
    }

    return (
        <div className="h-[calc(100vh-60px)]">
            <Container
                size="xl"
                className="px-4 sm:px-6 lg:px-8 py-4 md:py-8 !max-w-none h-full flex flex-col gap-y-3"
            >
                <Header />

                <AdminTabs />

                {children}
            </Container>
        </div>
    );
}
