import { LearnExam, LearnPractice, LearnSteps, LearnTheory } from "../";
import MobileHeader from "./MobileHeader";
import MobileSidebar from "./MobileSidebar";

interface MobileLayoutProps {
    title: string;
    isSidebarOpen: boolean;
    onToggleSidebar: () => void;
    onCloseSidebar: () => void;
}

const MobileLayout = ({
    title,
    isSidebarOpen,
    onToggleSidebar,
    onCloseSidebar,
}: MobileLayoutProps) => {
    return (
        <div className="flex flex-col h-full w-full lg:hidden">
            <MobileHeader title={title} onToggleSidebar={onToggleSidebar} />

            <MobileSidebar isOpen={isSidebarOpen} onClose={onCloseSidebar} />

            {/* Mobile Content Area */}
            <div className="flex-1 overflow-hidden">
                <LearnSteps
                    slots={{
                        Theory: () => <LearnTheory />,
                        Practice: () => <LearnPractice />,
                        Exam: () => <LearnExam />,
                    }}
                />
            </div>
        </div>
    );
};

export default MobileLayout;
