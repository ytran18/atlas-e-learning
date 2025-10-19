import { LearnExam, LearnPractice, LearnSteps, LearnTheory } from "../";
import { CourseType } from "../../../types";
import MobileHeader from "./MobileHeader";
import MobileSidebar from "./MobileSidebar";

interface MobileLayoutProps {
    title: string;
    isSidebarOpen: boolean;
    onToggleSidebar: () => void;
    onCloseSidebar: () => void;
    courseType: CourseType;
}

const MobileLayout = ({
    title,
    isSidebarOpen,
    onToggleSidebar,
    onCloseSidebar,
    courseType,
}: MobileLayoutProps) => {
    return (
        <div className="flex flex-col h-full w-full lg:hidden overflow-hidden">
            <MobileHeader title={title} onToggleSidebar={onToggleSidebar} />

            <MobileSidebar isOpen={isSidebarOpen} onClose={onCloseSidebar} />

            {/* Mobile Content Area */}
            <div className="flex-1 min-h-0 overflow-hidden p-4">
                <LearnSteps
                    slots={{
                        Theory: () => <LearnTheory courseType={courseType} />,
                        Practice: () => <LearnPractice courseType={courseType} />,
                        Exam: () => <LearnExam courseType={courseType} />,
                    }}
                />
            </div>
        </div>
    );
};

export default MobileLayout;
