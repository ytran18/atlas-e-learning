import { MobileLayout as SharedMobileLayout } from "@/features/shared";

interface MobileLayoutProps {
    title: string;
    isSidebarOpen: boolean;
    onToggleSidebar: () => void;
    onCloseSidebar: () => void;
}

const MobileLayout = (props: MobileLayoutProps) => {
    return <SharedMobileLayout {...props} courseType="hoc-nghe" />;
};

export default MobileLayout;
