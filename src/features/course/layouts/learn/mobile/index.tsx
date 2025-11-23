import LearnExam from "@/features/course/components/learn/learn-exam";
import LearnPractice from "@/features/course/components/learn/learn-practice";
import LearnSteps from "@/features/course/components/learn/learn-steps";
import LearnTheory from "@/features/course/components/learn/learn-theory";
import { CourseType } from "@/features/course/types";

import MobileLearnHeader from "./header";
import MobileSidebar from "./sidebar";

interface MobileLayoutProps {
    title: string;
    isSidebarOpen: boolean;
    onToggleSidebar: () => void;
    onCloseSidebar: () => void;
    courseType: CourseType;
}

const MobileLearnLayout = ({
    title,
    isSidebarOpen,
    onToggleSidebar,
    onCloseSidebar,
    courseType,
}: MobileLayoutProps) => {
    return (
        <div className="flex flex-col h-full w-full lg:hidden overflow-hidden">
            <MobileLearnHeader title={title} onToggleSidebar={onToggleSidebar} />

            <MobileSidebar
                isOpen={isSidebarOpen}
                onClose={onCloseSidebar}
                courseType={courseType}
            />

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

export default MobileLearnLayout;
