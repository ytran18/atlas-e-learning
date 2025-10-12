"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Badge, Card, Container, Group, Tabs, Text, ThemeIcon, Title } from "@mantine/core";
import { IconChartBar } from "@tabler/icons-react";

import { AdminHeader } from "@/components/Admin/AdminHeader";
import { AdminTabs } from "@/components/Admin/AdminTab";
import { adminNavItems } from "@/constants/adminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const currentTab = pathname.includes("/hoc-nghe")
        ? "hoc-nghe"
        : pathname.includes("/user")
          ? "user"
          : "atld";

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100">
            <Container size="xl" className="px-4 sm:px-6 lg:px-8 py-4 md:py-8">
                {/* Header */}
                <AdminHeader />

                {/* Navigation Tabs */}
                <AdminTabs currentTab={currentTab} />

                {/* Content */}
                <Card
                    shadow="md"
                    radius="lg"
                    className="bg-white/90 backdrop-blur-sm min-h-96 p-4 md:p-8"
                >
                    {children}
                </Card>
            </Container>
        </div>
    );
}
