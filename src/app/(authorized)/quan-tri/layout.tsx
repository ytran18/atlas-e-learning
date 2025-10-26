import { Container } from "@mantine/core";

import AdminTabs from "@/features/quan-tri/components/AdminTabs";
import Header from "@/features/quan-tri/components/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
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
