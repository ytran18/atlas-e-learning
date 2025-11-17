"use client";

import { redirect } from "next/navigation";

import { useClerk } from "@clerk/nextjs";
import { Container } from "@mantine/core";

import AdminTabs from "@/features/quan-tri/components/AdminTabs";
import Header from "@/features/quan-tri/components/Header";
import { navigationPaths } from "@/utils/navigationPaths";

export default function Layout({ children }: { children: React.ReactNode }) {
    const { user, loaded } = useClerk();

    const isAdmin = user?.unsafeMetadata.role === "admin";

    const isStaff = user?.unsafeMetadata.role === "staff";

    if (!isAdmin && !isStaff && loaded) {
        redirect(navigationPaths.LANDING_PAGE);
    }

    return (
        <div className="h-[calc(100vh-60px)]">
            <Container
                size="xl"
                className="px-4 sm:px-6 lg:px-8 py-2 md:py-4 max-w-none! h-full flex flex-col gap-y-3"
            >
                <Header />

                <AdminTabs />

                {children}
            </Container>
        </div>
    );
}
