import { LearnExam, LearnPractice, LearnSidebar, LearnSteps, LearnTheory } from "../";
import { CourseType } from "../../../types";

interface DesktopLayoutProps {
    courseType: CourseType;
}

const DesktopLayout = ({ courseType }: DesktopLayoutProps) => {
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

export default DesktopLayout;
