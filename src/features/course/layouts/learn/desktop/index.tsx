import LearnExam from "@/features/course/components/learn/learn-exam";
import LearnPractice from "@/features/course/components/learn/learn-practice";
import LearnSidebar from "@/features/course/components/learn/learn-sidebar";
import LearnSteps from "@/features/course/components/learn/learn-steps";
import LearnTheory from "@/features/course/components/learn/learn-theory";
import { CourseType } from "@/types/api";

interface DesktopLearnLayoutProps {
    courseType: CourseType;
}

const DesktopLearnLayout = ({ courseType }: DesktopLearnLayoutProps) => {
    return (
        <div className="hidden lg:flex h-full w-full p-4 gap-4 overflow-hidden">
            <div className="w-80 shrink-0 h-full overflow-y-auto">
                <LearnSidebar courseType={courseType} />
            </div>

            <div className="flex-1 h-full">
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

export default DesktopLearnLayout;
