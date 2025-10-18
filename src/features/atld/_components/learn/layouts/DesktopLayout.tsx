import { LearnExam, LearnPractice, LearnSidebar, LearnSteps, LearnTheory } from "../";

const DesktopLayout = () => {
    return (
        <div className="hidden lg:flex h-full w-full p-4 gap-4 overflow-hidden">
            <div className="w-80 flex-shrink-0 h-full overflow-y-auto">
                <LearnSidebar />
            </div>

            <div className="flex-1 h-full">
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

export default DesktopLayout;
